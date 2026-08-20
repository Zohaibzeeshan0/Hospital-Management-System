import Link from 'next/link';
import { HeartPulse, Stethoscope, Shield, Users, Activity, Eye, Smile, Baby, Bone, ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    { title: '24/7 Emergency Care', category: 'Emergency', desc: 'Immediate trauma resuscitation, ICU critical care, and round-the-clock emergency medical response.', img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80' },
    { title: 'Cardiology & Heart Center', category: 'Specialist', desc: 'Ischemic heart disease prevention, cardiac catheterization, open heart surgery, and ECG monitoring.', img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80' },
    { title: 'Pediatric & Adolescent Care', category: 'Pediatrics', desc: 'Specialized healthcare for infants, toddlers, adolescent immunology, and growth tracking.', img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80' },
    { title: 'Surgical Operations', category: 'Surgery', desc: 'Minimally invasive laparoscopic surgeries, orthopedic joint replacements, and emergency procedures.', img: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80' },
    { title: 'Diagnostic Laboratory', category: 'Diagnostics', desc: 'Automated blood biochemistry, hematology, lipid profiling, and molecular genetics.', img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80' },
    { title: 'Pharmacy & Drug Store', category: 'Pharmacy', desc: 'Full-spectrum prescription fulfillment, generic pharmaceuticals, and medication therapy management.', img: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=800&auto=format&fit=crop&q=80' },
    { title: 'Radiology & Imaging', category: 'Imaging', desc: 'High-resolution Digital Chest X-Rays, 3T Brain MRI, 128-Slice CT Scans, and Ultrasound.', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80' },
    { title: 'Dental & Oral Health', category: 'Dentistry', desc: 'Cosmetic restorative dentistry, root canals, orthodontics, and oral maxillofacial surgery.', img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80' },
    { title: 'Ophthalmology & Eye Care', category: 'Eye Care', desc: 'Cataract laser surgery, glaucoma management, refractive cornea correction, and vision therapy.', img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white shadow-md">
              <HeartPulse className="h-6 w-6 animate-pulse" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Medi<span className="text-sky-600">Pulse</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-xs font-semibold text-slate-700 hover:text-sky-600">Sign In</Link>
            <Link href="/auth/login?role=patient" className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white shadow-md">
              Book Appointment
            </Link>
          </div>
        </div>
      </header>

      {/* Services Grid Hero */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Clinical Departments</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Public Hospital Services & Facilities</h1>
            <p className="text-slate-600 text-sm">State-of-the-art medical services delivered by world-class specialists and cutting-edge technology.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((srv, idx) => (
              <div key={idx} className="group rounded-3xl border border-slate-200 bg-slate-50/50 p-4 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="overflow-hidden rounded-2xl h-48 mb-4">
                  <img src={srv.img} alt={srv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px] uppercase tracking-wider mb-2 inline-block">
                  {srv.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{srv.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{srv.desc}</p>
                <Link href="/auth/login?role=patient" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
                  Schedule Consult <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
