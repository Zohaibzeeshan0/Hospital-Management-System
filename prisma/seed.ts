import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Hospital Management System database for Sections 56-70...');

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.labReport.deleteMany();
  await prisma.labTestCatalog.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.prescriptionItem.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctorLeave.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Admin Accounts
  await prisma.user.create({
    data: {
      email: 'admin@hospital.test',
      password: passwordHash,
      name: 'Chief Admin (Hospital.test)',
      role: 'ADMIN',
      phone: '+1 (555) 019-2831',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    },
  });

  const mainAdmin = await prisma.user.create({
    data: {
      email: 'admin@medipulse.com',
      password: passwordHash,
      name: 'Dr. Arthur Pendelton (Admin)',
      role: 'ADMIN',
      phone: '+1 (555) 019-2831',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    },
  });

  // 2. 10 Departments
  const deptData = [
    { name: 'Cardiology', code: 'CARD', desc: 'Cardiovascular disease prevention and open heart surgery.', icon: 'HeartPulse' },
    { name: 'Neurology', code: 'NEUR', desc: 'Brain, spinal cord, and peripheral nerve disorders treatment.', icon: 'Brain' },
    { name: 'Pediatrics', code: 'PED', desc: 'Specialized healthcare for infants, toddlers, and adolescents.', icon: 'Baby' },
    { name: 'Orthopedics', code: 'ORTH', desc: 'Bone, joint, ligament, and musculoskeletal surgery.', icon: 'Bone' },
    { name: 'Dermatology', code: 'DERM', desc: 'Skin, hair, nail pathology, and laser dermatology.', icon: 'Sparkles' },
    { name: 'Gynecology', code: 'GYN', desc: 'Women health, obstetrics, and maternal medicine.', icon: 'Users' },
    { name: 'General Medicine', code: 'GEN', desc: 'Primary care, chronic disease management, and internal medicine.', icon: 'Stethoscope' },
    { name: 'ENT', code: 'ENT', desc: 'Ear, nose, throat, head and neck oncological surgeries.', icon: 'Activity' },
    { name: 'Dentistry', code: 'DENT', desc: 'Orthodontics, root canals, and oral maxillofacial surgery.', icon: 'Smile' },
    { name: 'Ophthalmology', code: 'OPHTH', desc: 'Cataract laser surgery, glaucoma management, and cornea correction.', icon: 'Eye' },
  ];

  const departments: any[] = [];
  for (const d of deptData) {
    const created = await prisma.department.create({
      data: {
        name: d.name,
        code: d.code,
        description: d.desc,
        icon: d.icon,
      },
    });
    departments.push(created);
  }

  // 3. 10 Doctors
  const doctorSeeds = [
    { email: 'doctor@hospital.test', name: 'Dr. Sarah Smith', deptIdx: 0, spec: 'Interventional Cardiology', fee: 150.0, lic: 'MED-NY-84920' },
    { email: 'doctor.smith@medipulse.com', name: 'Dr. Sarah Smith', deptIdx: 0, spec: 'Chief Cardiology Specialist', fee: 150.0, lic: 'MED-NY-84921' },
    { email: 'doctor.chen@medipulse.com', name: 'Dr. Michael Chen', deptIdx: 1, spec: 'Neuro-oncology & Epilepsy', fee: 175.0, lic: 'MED-MD-91823' },
    { email: 'doctor.emily@medipulse.com', name: 'Dr. Emily Watson', deptIdx: 2, spec: 'Pediatric Immunology', fee: 120.0, lic: 'MED-CA-33441' },
    { email: 'doctor.james@medipulse.com', name: 'Dr. James Wilson', deptIdx: 3, spec: 'Orthopedic Joint Replacement', fee: 180.0, lic: 'MED-TX-77882' },
    { email: 'doctor.lisa@medipulse.com', name: 'Dr. Lisa Ray', deptIdx: 4, spec: 'Cosmetic Dermatology', fee: 135.0, lic: 'MED-FL-99112' },
    { email: 'doctor.robert@medipulse.com', name: 'Dr. Robert Taylor', deptIdx: 5, spec: 'Obstetrics & Maternal Care', fee: 160.0, lic: 'MED-IL-22334' },
    { email: 'doctor.david@medipulse.com', name: 'Dr. David Miller', deptIdx: 6, spec: 'Internal Medicine & Geriatrics', fee: 110.0, lic: 'MED-WA-44556' },
    { email: 'doctor.sophia@medipulse.com', name: 'Dr. Sophia Garcia', deptIdx: 7, spec: 'Head & Neck ENT Surgery', fee: 145.0, lic: 'MED-OH-66778' },
    { email: 'doctor.alex@medipulse.com', name: 'Dr. Alex Turner', deptIdx: 8, spec: 'Maxillofacial Dentistry', fee: 130.0, lic: 'MED-PA-88990' },
  ];

  const doctors: any[] = [];
  for (const doc of doctorSeeds) {
    const user = await prisma.user.create({
      data: {
        email: doc.email,
        password: passwordHash,
        name: doc.name,
        role: 'DOCTOR',
        avatarUrl: `https://images.unsplash.com/photo-1594824813566-8185b9b94042?w=400&auto=format&fit=crop&q=80`,
      },
    });

    const doctorProfile = await prisma.doctorProfile.create({
      data: {
        userId: user.id,
        qualification: 'MD, Board Certified',
        licenseNo: doc.lic,
        specialization: doc.spec,
        departmentId: departments[doc.deptIdx].id,
        experienceYears: 10 + Math.floor(Math.random() * 10),
        consultationFee: doc.fee,
        bio: `${doc.name} is a leading specialist in ${doc.spec} with extensive clinical research experience.`,
        rating: 4.8 + Math.random() * 0.2,
      },
    });

    // Add schedule
    for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
      await prisma.schedule.create({
        data: {
          doctorId: doctorProfile.id,
          dayOfWeek: day,
          startTime: '09:00 AM',
          endTime: '05:00 PM',
          breakStart: '01:00 PM',
          breakEnd: '02:00 PM',
          slotDuration: 30,
          maxPatients: 14,
        },
      });
    }

    doctors.push({ user, doctorProfile });
  }

  // 4. 30 Demo Patients
  const patients: any[] = [];
  const patientNames = [
    'John Doe', 'Emma Watson', 'Robert Vance', 'Elena Rostova', 'David Miller',
    'Sophia Martinez', 'Liam Johnson', 'Olivia Brown', 'Noah Davis', 'Ava Wilson',
    'Ethan Anderson', 'Isabella Thomas', 'Mason Taylor', 'Mia Moore', 'Lucas Jackson',
    'Charlotte Martin', 'Oliver Lee', 'Amelia Perez', 'Elijah Thompson', 'Harper White',
    'Logan Harris', 'Evelyn Sanchez', 'James Clark', 'Abigail Ramirez', 'Benjamin Lewis',
    'Emily Robinson', 'Henry Walker', 'Elizabeth Young', 'Alexander Allen', 'Sofia King',
  ];

  for (let i = 0; i < patientNames.length; i++) {
    const name = patientNames[i];
    const email = i === 0 ? 'patient@hospital.test' : i === 1 ? 'patient.john@gmail.com' : `patient.${i}@hospital.test`;

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name,
        role: 'PATIENT',
        avatarUrl: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80`,
      },
    });

    const patientProfile = await prisma.patientProfile.create({
      data: {
        userId: user.id,
        patientCode: `PAT-2026-${100 + i}`,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        dateOfBirth: new Date(1985 + (i % 25), i % 12, 10 + (i % 15)),
        bloodGroup: ['A+', 'O+', 'B+', 'AB+', 'O-'][i % 5],
        allergies: i % 3 === 0 ? 'Penicillin' : 'None reported',
        medicalConditions: i % 2 === 0 ? 'Essential Hypertension' : 'Type 2 Diabetes',
      },
    });

    patients.push({ user, patientProfile });
  }

  // 5. 30 Medicines
  const medicineNames = [
    'Amoxicillin 500mg', 'Lipitor 20mg', 'Metformin 850mg', 'Ventolin HFA Inhaler', 'Amlodipine 5mg',
    'Omeprazole 20mg', 'Losartan 50mg', 'Atorvastatin 40mg', 'Gabapentin 300mg', 'Hydrochlorothiazide 25mg',
    'Sertraline 50mg', 'Simvastatin 20mg', 'Montelukast 10mg', 'Pantoprazole 40mg', 'Furosemide 40mg',
    'Fluticasone Nasal Spray', 'Escitalopram 10mg', 'Fluoxetine 20mg', 'Levothyroxine 50mcg', 'Rosuvastatin 10mg',
    'Prednisone 10mg', 'Tamsulosin 0.4mg', 'Duloxetine 30mg', 'Azithromycin 250mg', 'Ciprofloxacin 500mg',
    'Doxycycline 100mg', 'Metoprolol Tartrate 50mg', 'Carvedilol 12.5mg', 'Lisinopril 10mg', 'Clopidogrel 75mg',
  ];

  for (let i = 0; i < medicineNames.length; i++) {
    await prisma.medicine.create({
      data: {
        name: medicineNames[i],
        genericName: medicineNames[i].split(' ')[0],
        category: i % 2 === 0 ? 'Cardiovascular' : 'Antibiotic',
        manufacturer: 'Global Med Pharma',
        price: 10 + Math.floor(Math.random() * 40),
        stockQuantity: 100 + i * 20,
        expiryDate: new Date('2028-12-31'),
        status: 'IN_STOCK',
      },
    });
  }

  // 6. 15 Lab Tests Catalog
  const labTestsList = [
    'Complete Blood Count (CBC)', 'Fasting Blood Glucose', 'Lipid Profile Panel', 'Liver Function Test (LFT)',
    'Kidney Function Test (KFT)', 'Thyroid Profile (T3, T4, TSH)', 'HbA1c Diabetes Monitoring', 'Urinalysis Routine',
    'Chest X-Ray (PA View)', 'Abdominal Ultrasound', 'Brain 3T MRI Scan', 'CT Angiography',
    'Electrocardiogram (12-Lead ECG)', 'Echocardiogram 2D', 'Vitamin D3 Level',
  ];

  for (let i = 0; i < labTestsList.length; i++) {
    await prisma.labTestCatalog.create({
      data: {
        name: labTestsList[i],
        testCode: `LAB-${100 + i}`,
        category: i < 5 ? 'Biochemistry' : i < 10 ? 'Radiology' : 'Diagnostic',
        price: 30 + i * 15,
        sampleType: i < 8 ? 'Blood' : 'Imaging',
        turnaround: '24 Hours',
      },
    });
  }

  // 7. Appointments & Clinical Consultations
  const today = new Date();
  const appt = await prisma.appointment.create({
    data: {
      appointmentNo: 'APT-2026-5001',
      patientId: patients[0].patientProfile.id,
      doctorId: doctors[0].doctorProfile.id,
      departmentId: departments[0].id,
      date: today,
      timeSlot: '10:00 AM - 10:30 AM',
      reason: 'Hypertension checkup and chest pain consultation.',
      status: 'COMPLETED',
      paymentStatus: 'PAID',
    },
  });

  await prisma.medicalRecord.create({
    data: {
      patientId: patients[0].patientProfile.id,
      doctorId: doctors[0].doctorProfile.id,
      appointmentId: appt.id,
      chiefComplaint: 'Chest tightness when exercising.',
      symptoms: 'Shortness of breath and mild palpitations.',
      diagnosis: 'Essential Hypertension (Grade I)',
      examinationNotes: 'Regular heart rate. S1/S2 clear.',
      treatmentPlan: 'Low sodium diet, Amlodipine 5mg once daily.',
      doctorNotes: 'Recheck blood pressure in 2 weeks.',
      bloodPressure: '135/85 mmHg',
      heartRate: '74 bpm',
      temperature: '98.6 °F',
      oxygenSaturation: '99%',
      weight: '75 kg',
      height: '178 cm',
      bmi: '23.7 kg/m²',
    },
  });

  await prisma.prescription.create({
    data: {
      prescriptionNo: 'RX-2026-9001',
      patientId: patients[0].patientProfile.id,
      doctorId: doctors[0].doctorProfile.id,
      appointmentId: appt.id,
      instructions: 'Take medication every morning after breakfast.',
      status: 'ACTIVE',
      items: {
        create: [
          { medicineName: 'Amlodipine Besylate', dosage: '5mg', frequency: 'Once Daily', duration: '30 Days', route: 'Oral', instructions: 'After breakfast' },
        ],
      },
    },
  });

  await prisma.review.create({
    data: {
      patientUserId: patients[0].user.id,
      doctorId: doctors[0].doctorProfile.id,
      appointmentId: appt.id,
      rating: 5,
      comment: 'Dr. Sarah Smith was exceptionally thorough, attentive, and knowledgeable. Highly recommended!',
      status: 'APPROVED',
    },
  });

  console.log('Sections 56-70 database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
