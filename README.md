# MediPulse Hospital Management System (HMS) — Full-Stack Production Web Application

[![Next.js](https://img.shields.io/badge/Next.js-14.2-blue.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-teal.svg)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-indigo.svg)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A complete, professional, modern, responsive Hospital Management System (HMS) built as a production-grade full-stack web application across all **70 Sections**.

---

## 🔑 Demo Login Accounts

Use any of the demo accounts below or use the **1-Click Demo Login Buttons** on the Login Page (`http://localhost:3000/auth/login`):

### 🛡️ Admin Accounts
- **Email**: `admin@hospital.test` or `admin@medipulse.com`
- **Password**: `password123`
- **Access**: Global executive dashboard, Recharts revenue analytics, Doctor/Patient CRUD, Master appointments, Emergency trauma, Wards & Bed occupancy, Inpatient admissions, Diagnostic Lab catalog, Pharmacy stock, Hospital inventory, Itemized billing, Analytics reports export (CSV/PDF), and Security audit logs.

### 🩺 Doctor Accounts
- **Email**: `doctor@hospital.test` or `doctor.smith@medipulse.com`
- **Password**: `password123`
- **Access**: Clinical workspace, today's/upcoming roster, **Full Consultation Suite** with **8 Vital Signs** & auto-calculated BMI, Multi-medicine Digital Prescription builder, Patient longitudinal medical timeline, and Weekly availability schedule manager.

### 👤 Patient Accounts
- **Email**: `patient@hospital.test` or `patient.john@gmail.com`
- **Password**: `password123`
- **Access**: Health dashboard, **4-Step Real-Time Slot Appointment Booking Wizard** (double-booking protection), Specialist doctor directory & profiles, **Medical Vault** (read-only visit diagnoses, printable prescriptions, lab reports), Doctor reviews, and Online credit card invoice checkout.

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Recharts (analytics charts), Lucide Icons, and Framer Motion micro-animations.
- **Backend & API**: Next.js Server Actions & API Route Handlers, JWT HTTP-only cookie authentication, bcrypt password hashing, and Next.js Edge Middleware for Role-Based Access Control (`/admin/*`, `/doctor/*`, `/patient/*`).
- **Database & ORM**: Prisma ORM with SQLite (`prisma/dev.db`), featuring normalized schema models (`User`, `DoctorProfile`, `PatientProfile`, `Department`, `Schedule`, `Appointment`, `MedicalRecord`, `Prescription`, `PrescriptionItem`, `Medicine`, `LabTestCatalog`, `LabReport`, `InventoryItem`, `EmergencyCase`, `Room`, `Bed`, `Admission`, `Discharge`, `Invoice`, `Payment`, `Review`, `AuditLog`, `Notification`).
- **Service Abstractions**:
  - `src/lib/payment.ts`: Payment gateway wrapper supporting Cash, Card, Bank Transfer, Online checkout (Stripe/PayPal ready).
  - `src/lib/email.ts`: Email notification engine supporting dev logging & SMTP/Resend integration.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js v18.x or later
- npm or yarn

### 2. Installation & Setup
```bash
# Clone or open workspace
cd "Hospital Management System"

# Install dependencies
npm install

# Push database schema
npx prisma db push

# Seed realistic demo data (10 Doctors, 30 Patients, 30 Medicines, 15 Lab Tests)
npm run seed

# Run production build compilation check
npm run build

# Start local development server
npm run dev
```

### 3. Opening the Web Application
Open your browser and navigate to:
```bash
http://localhost:3000
```

---

## 📋 Features Checklist (V1 – V70)

- [x] Public Hospital Website (Hero, About, Services, Contact, FAQ)
- [x] 1-Click Demo Credentials for Admin, Doctor, Patient
- [x] Role-Based Access Control (RBAC Edge Middleware)
- [x] Executive Dashboard & Recharts Analytics
- [x] Doctor Roster Management (Add, Edit, Suspend, Fee setup)
- [x] Patient Directory & Clinical History Drawer
- [x] Master Appointment Control & Real-Time Availability Engine
- [x] Doctor Consultation Room with 8 Vital Signs & BMI Calculator
- [x] Multi-Medicine Digital Prescription Builder with Route Options
- [x] Doctor Schedule Manager & Leave Slot Blocking
- [x] 4-Step Patient Appointment Booking Wizard (Double-Booking Protection)
- [x] Patient Medical Vault (Diagnoses, Printable Rx, Lab Reports)
- [x] Emergency Trauma & Triage Response (STAT Priority Badges)
- [x] Wards, Rooms & Bed Occupancy Management
- [x] Inpatient Admission & Discharge Summary Document Generator
- [x] Diagnostic Laboratory Test Catalog & Processing Stream
- [x] Pharmacy & General Hospital Supplies Inventory Management
- [x] Itemized Billing & Simulated Credit Card Checkout
- [x] Patient Doctor Reviews & Ratings Engine
- [x] Executive CSV / PDF Analytics Report Export
- [x] Security Audit Logs & Medical Data Authorization Guards
- [x] Light / Dark Mode Visual Consistency
- [x] Custom 404 & Error Boundary Pages

---

## 📜 License
This project is licensed under the MIT License.
