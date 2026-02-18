import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SiteSettings {
    siteName: string;
    logoUrl: string;
}
export type Time = bigint;
export interface ContactMessage {
    id: bigint;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export interface Section {
    id: bigint;
    title: string;
    content: string;
}
export interface GalleryItem {
    id: bigint;
    title: string;
    imageUrl: string;
    caption: string;
}
export interface ContactInfo {
    email: string;
    address: string;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    imageUrl: string;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAdminAccount(username: string, password: string, adminToken: string): Promise<void>;
    addGalleryItem(title: string, caption: string, imageUrl: string, adminToken: string): Promise<void>;
    addProduct(name: string, description: string, price: bigint, imageUrl: string, adminToken: string): Promise<void>;
    adminLogin(username: string, password: string): Promise<string | null>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    changeAdminPassword(adminToken: string, newPassword: string): Promise<void>;
    changeOtherAdminPassword(adminToken: string, username: string, newPassword: string): Promise<void>;
    createSection(title: string, content: string, adminToken: string): Promise<void>;
    deleteAdminAccount(adminToken: string, username: string): Promise<void>;
    deleteGalleryItem(id: bigint, adminToken: string): Promise<void>;
    deleteMessage(id: bigint, adminToken: string): Promise<void>;
    deleteProduct(id: bigint, adminToken: string): Promise<void>;
    deleteSection(id: bigint, adminToken: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo>;
    getGallery(): Promise<Array<GalleryItem>>;
    getMessages(adminToken: string): Promise<Array<ContactMessage>>;
    getProducts(): Promise<Array<Product>>;
    getSections(): Promise<Array<Section>>;
    getSiteSettings(): Promise<SiteSettings>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    health(): Promise<string>;
    initializeContent(adminToken: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listAdminAccounts(adminToken: string): Promise<Array<string>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(name: string, email: string, message: string): Promise<void>;
    updateContactInfo(address: string, phone: string, email: string, adminToken: string): Promise<void>;
    updateGalleryItem(id: bigint, title: string, caption: string, imageUrl: string, adminToken: string): Promise<void>;
    updateProduct(id: bigint, name: string, description: string, price: bigint, imageUrl: string, adminToken: string): Promise<void>;
    updateSection(id: bigint, title: string, content: string, adminToken: string): Promise<void>;
    updateSiteSettings(siteName: string, logoUrl: string, adminToken: string): Promise<void>;
}
