import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Random "mo:core/Random";
import Blob "mo:core/Blob";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  // CMS Types
  public type Section = {
    id : Nat;
    title : Text;
    content : Text;
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    imageUrl : Text;
  };

  public type GalleryItem = {
    id : Nat;
    title : Text;
    caption : Text;
    imageUrl : Text;
  };

  public type ContactInfo = {
    address : Text;
    phone : Text;
    email : Text;
  };

  public type ContactMessage = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  public type SiteSettings = {
    siteName : Text;
    logoUrl : Text;
  };

  // State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let sections = Map.empty<Nat, Section>();
  let products = Map.empty<Nat, Product>();
  let gallery = Map.empty<Nat, GalleryItem>();
  let messages = Map.empty<Nat, ContactMessage>();
  var contactInfo : ContactInfo = {
    address = "123 Street";
    phone = "123-456-7890";
    email = "info@atikautoricemills.com";
  };
  var siteSettings : SiteSettings = {
    siteName = "Atika Auto Rice Mills";
    logoUrl = "/logo.png";
  };
  var nextId = 1;

  // Admin token management
  let adminTokens = Map.empty<Text, Time.Time>();
  var tokenCounter : Nat = 0;
  let TOKEN_EXPIRY_NS : Time.Time = 24 * 60 * 60 * 1_000_000_000; // 24 hours in nanoseconds

  // Generate a simple but unique admin token
  func generateAdminToken() : Text {
    tokenCounter += 1;
    let timestamp = Time.now();
    "admin_token_" # tokenCounter.toText() # "_" # Int.abs(timestamp).toText();
  };

  // Admin authentication functions
  public shared ({ caller }) func adminLogin(username : Text, password : Text) : async ?Text {
    if (Text.equal(username, "admin") and Text.equal(password, "admin")) {
      let token = generateAdminToken();
      let now = Time.now();
      adminTokens.add(token, now);
      ?token;
    } else {
      null;
    };
  };

  // Verify admin token - returns true if valid, false otherwise
  func isValidAdminToken(token : ?Text) : Bool {
    switch (token) {
      case (null) { false };
      case (?t) {
        switch (adminTokens.get(t)) {
          case (null) { false };
          case (?issuedTime) {
            let now = Time.now();
            let age = now - issuedTime;
            if (age > TOKEN_EXPIRY_NS) {
              // Token expired, remove it
              adminTokens.remove(t);
              false;
            } else {
              true;
            };
          };
        };
      };
    };
  };

  // Verify admin token and trap if invalid
  func requireAdminToken(token : ?Text) : () {
    if (not isValidAdminToken(token)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin Functions - Content Management
  public shared ({ caller }) func createSection(title : Text, content : Text, adminToken : ?Text) : async () {
    requireAdminToken(adminToken);

    let id = nextId;
    let newSection : Section = { id; title; content };
    sections.add(id, newSection);
    nextId += 1;
  };

  public shared ({ caller }) func updateSection(id : Nat, title : Text, content : Text, adminToken : ?Text) : async () {
    requireAdminToken(adminToken);

    switch (sections.get(id)) {
      case (null) { Runtime.trap("Section not found") };
      case (?_) {
        let updatedSection : Section = { id; title; content };
        sections.add(id, updatedSection);
      };
    };
  };

  public shared ({ caller }) func deleteSection(id : Nat, adminToken : ?Text) : async () {
    requireAdminToken(adminToken);

    if (not sections.containsKey(id)) {
      Runtime.trap("Section not found");
    };
    sections.remove(id);
  };

  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Nat, imageUrl : Text, adminToken : ?Text) : async () {
    requireAdminToken(adminToken);

    let id = nextId;
    let newProduct : Product = { id; name; description; price; imageUrl };
    products.add(id, newProduct);
    nextId += 1;
  };

  public shared ({ caller }) func updateProduct(id : Nat, name : Text, description : Text, price : Nat, imageUrl : Text, adminToken : ?Text) : async () {
    requireAdminToken(adminToken);

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let updatedProduct : Product = { id; name; description; price; imageUrl };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat, adminToken : ?Text) : async () {
    requireAdminToken(adminToken);

    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  public shared ({ caller }) func addGalleryItem(title : Text, caption : Text, imageUrl : Text, adminToken : ?Text) : async () {
    requireAdminToken(adminToken);

    let id = nextId;
    let newItem : GalleryItem = { id; title; caption; imageUrl };
    gallery.add(id, newItem);
    nextId += 1;
  };

  public shared ({ caller }) func updateGalleryItem(id : Nat, title : Text, caption : Text, imageUrl : Text, adminToken : ?Text) : async () {
    requireAdminToken(adminToken);

    switch (gallery.get(id)) {
      case (null) { Runtime.trap("Gallery item not found") };
      case (?_) {
        let updatedItem : GalleryItem = { id; title; caption; imageUrl };
        gallery.add(id, updatedItem);
      };
    };
  };

  public shared ({ caller }) func deleteGalleryItem(id : Nat, adminToken : ?Text) : async () {
    requireAdminToken(adminToken);

    if (not gallery.containsKey(id)) {
      Runtime.trap("Gallery item not found");
    };
    gallery.remove(id);
  };

  public shared ({ caller }) func updateContactInfo(address : Text, phone : Text, email : Text, adminToken : ?Text) : async () {
    requireAdminToken(adminToken);

    contactInfo := { address; phone; email };
  };

  public shared ({ caller }) func updateSiteSettings(siteName : Text, logoUrl : Text, adminToken : ?Text) : async () {
    requireAdminToken(adminToken);

    siteSettings := { siteName; logoUrl };
  };

  public shared ({ caller }) func deleteMessage(id : Nat, adminToken : ?Text) : async () {
    requireAdminToken(adminToken);

    messages.remove(id);
  };

  public shared ({ caller }) func initializeContent(adminToken : ?Text) : async () {
    requireAdminToken(adminToken);

    // Initial content
    sections.add(
      nextId,
      {
        id = nextId;
        title = "About Us";
        content = "Welcome to Atika Auto Rice Mills.";
      },
    );
    nextId += 1;

    products.add(
      nextId,
      {
        id = nextId;
        name = "Premium Rice";
        description = "High-quality rice.";
        price = 100;
        imageUrl = "/products/rice.jpg";
      },
    );
    nextId += 1;

    gallery.add(
      nextId,
      {
        id = nextId;
        title = "Factory";
        caption = "Our factory facilities.";
        imageUrl = "/gallery/factory.jpg";
      },
    );
    nextId += 1;
  };

  // Public Query Functions - No authentication required (guests can view)
  public query ({ caller }) func getSections() : async [Section] {
    let iter = sections.values();
    iter.toArray();
  };

  public query ({ caller }) func getProducts() : async [Product] {
    let iter = products.values();
    iter.toArray();
  };

  public query ({ caller }) func getGallery() : async [GalleryItem] {
    let iter = gallery.values();
    iter.toArray();
  };

  public query ({ caller }) func getContactInfo() : async ContactInfo {
    contactInfo;
  };

  public query ({ caller }) func getSiteSettings() : async SiteSettings {
    siteSettings;
  };

  // Admin panel function - requires admin permission
  // Changed to shared (update call) because query functions cannot reliably trap
  public shared ({ caller }) func getMessages(adminToken : ?Text) : async [ContactMessage] {
    requireAdminToken(adminToken);

    messages.values().toArray();
  };

  // Public function - anyone including guests can submit contact messages
  public shared ({ caller }) func sendMessage(name : Text, email : Text, message : Text) : async () {
    let id = nextId;
    let newMessage : ContactMessage = {
      id;
      name;
      email;
      message;
      timestamp = Time.now();
    };
    messages.add(id, newMessage);
    nextId += 1;
  };
};
