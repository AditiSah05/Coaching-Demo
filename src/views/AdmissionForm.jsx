"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Upload, Printer, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';

const steps = [
  { title: 'Personal details', note: 'Enter your name as it appears on your 10th certificate.' },
  { title: 'Academics', note: 'Your marks decide which courses you can join.' },
  { title: 'Course and batch', note: 'Choose the course and the timing that suits you.' },
  { title: 'Documents', note: 'Upload a marksheet if you have one. This step is optional.' },
  { title: 'Review', note: 'Check everything before you submit.' },
];

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
const inputBase = 'h-12 w-full rounded-xl border bg-white px-4 text-base text-navy-deep placeholder:text-ink/35 transition-colors focus:border-navy-deep focus:outline-none focus:ring-2 focus:ring-gold/50';

const Field = ({ label, name, error, hint, children }) => (
  <div>
    <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-navy-deep">{label}</label>
    {children}
    {hint && !error && <p id={`${name}-hint`} className="mt-1.5 text-sm text-ink/55">{hint}</p>}
    {error && <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm font-medium text-red-700">{error}</p>}
  </div>
);

// Returns an error message for one field, or '' when the value is acceptable.
const fieldRules = {
  fullName: (v) => (!v.trim() ? 'Enter your full name.' : ''),
  fatherName: (v) => (!v.trim() ? 'Enter your father\u2019s or guardian\u2019s name.' : ''),
  email: (v) => (!v.trim() ? 'Enter an email address we can reach you on.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address, like name@example.com.'),
  phone: (v) => {
    const digits = v.replace(/\D/g, '');
    if (!v.trim()) return 'Enter a mobile number, preferably one with WhatsApp.';
    return digits.length >= 10 && digits.length <= 13 ? '' : 'Enter a valid mobile number. It must have 10 digits.';
  },
  dob: (v) => (!v ? 'Choose your date of birth.' : ''),
  pcmPercentage: (v) => (v === '' ? 'Enter your PCM percentage, for example 78.5.' : Number(v) >= 0 && Number(v) <= 100 ? '' : 'Enter a percentage between 0 and 100.'),
  englishPercentage: (v) => (v === '' ? 'Enter your English percentage, for example 82.' : Number(v) >= 0 && Number(v) <= 100 ? '' : 'Enter a percentage between 0 and 100.'),
  courseName: (v) => (!v ? 'Choose a course to continue.' : ''),
};
const stepFields = { 1: ['fullName', 'fatherName', 'email', 'phone', 'dob'], 2: ['pcmPercentage', 'englishPercentage'], 3: ['courseName'] };

// Characters allowed while typing: letters are dropped from number fields.
const typingFilters = {
  phone: (v) => v.replace(/[^\d+\s-]/g, ''),
  pcmPercentage: (v) => v.replace(/[^\d.]/g, ''),
  englishPercentage: (v) => v.replace(/[^\d.]/g, ''),
};

const ReviewGroup = ({ title, onEdit, rows }) => (
  <section className="rounded-2xl border border-navy-deep/10 bg-ivory p-5 sm:p-6">
    <div className="mb-4 flex items-center justify-between gap-4">
      <h3 className="font-serif text-lg font-semibold text-navy-deep">{title}</h3>
      <button type="button" onClick={onEdit} className={`rounded-full px-3 py-1 text-sm font-semibold text-goldtext hover:bg-gold-light ${focusRing}`}>Edit</button>
    </div>
    <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="text-sm text-ink/55">{k}</dt>
          <dd className="text-[15px] font-medium text-navy-deep break-words">{v || 'Not provided'}</dd>
        </div>
      ))}
    </dl>
  </section>
);

const ReceiptSheet = ({ data, settings }) => {
  const submitted = data.submittedAt ? new Date(data.submittedAt) : new Date();
  const dateText = submitted.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeText = submitted.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const sections = [
    ['Applicant', [
      ['Full name', data.fullName],
      ['Father or guardian', data.fatherName],
      ['Date of birth', data.dob && new Date(data.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
      ['Gender', data.gender],
      ['Email', data.email],
      ['Mobile', data.phone],
      ['City and state', [data.city, data.state].filter(Boolean).join(', ')],
    ]],
    ['Academics', [
      ['Studying', data.qualification],
      ['PCM percentage', data.pcmPercentage && `${data.pcmPercentage}%`],
      ['English percentage', data.englishPercentage && `${data.englishPercentage}%`],
    ]],
    ['Course applied for', [
      ['Course', data.courseName],
      ['Batch timing', data.batchPreference],
      ['Hostel', data.hostelRequired === 'Yes' ? 'Needed' : 'Not needed'],
    ]],
  ];
  return (
    <div className="hidden bg-white text-black print:block" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <header className="flex items-start justify-between border-b-2 border-black pb-4">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="" className="h-16 w-16 rounded-full" />
          <div>
            <p className="font-serif text-2xl font-bold leading-none">Pacific Marine Academy</p>
            <p className="mt-1.5 max-w-xs text-[11px] leading-snug">{settings?.address}</p>
            <p className="text-[11px]">{[settings?.phonePrimary, settings?.email].filter(Boolean).join('  |  ')}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-serif text-xl font-bold">Admission Acknowledgement</p>
          <p className="mt-1.5 text-[11px]">Date: {dateText}, {timeText}</p>
        </div>
      </header>

      <div className="mt-6 flex items-center justify-between border border-black px-5 py-3">
        <div>
          <p className="text-[11px]">Registration number</p>
          <p className="font-serif text-2xl font-bold tracking-wide">{data.id}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px]">Application status</p>
          <p className="text-base font-semibold">{data.status}</p>
        </div>
      </div>

      {sections.map(([title, rows]) => (
        <section key={title} className="mt-6" style={{ breakInside: 'avoid' }}>
          <h2 className="border-b border-black pb-1 font-serif text-base font-bold">{title}</h2>
          <table className="mt-1 w-full border-collapse text-[12px]">
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k} className="border-b border-neutral-300">
                  <td className="w-2/5 py-1.5 pr-4 text-neutral-600">{k}</td>
                  <td className="py-1.5 font-medium">{v || 'Not provided'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <p className="mt-6 text-[12px] leading-relaxed">
        Our admissions desk will contact you within 24 hours to verify documents and slot you into a batch. Please keep this acknowledgement for your records.
      </p>

      <div className="mt-14 flex justify-between text-[11px]">
        <div className="w-56 border-t border-black pt-1">Applicant signature</div>
        <div className="w-56 border-t border-black pt-1 text-right">Admissions desk</div>
      </div>
    </div>
  );
};

export const AdmissionForm = () => {
  const { courses, api, settings } = useData();
  const searchParams = useSearchParams();
  const preSelectedCourse = searchParams.get('course') || '';

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    fatherName: '',
    city: '',
    state: '',
    qualification: '12th PCM Passed',
    pcmPercentage: '',
    englishPercentage: '',
    courseName: preSelectedCourse || (courses[0]?.title || ''),
    batchPreference: 'Morning Regular Batch',
    hostelRequired: 'Yes',
    documentProof: ''
  });

  useEffect(() => {
    if (preSelectedCourse) {
      setFormData(prev => ({ ...prev, courseName: preSelectedCourse }));
    }
  }, [preSelectedCourse]);

  // After a failed Continue, move focus to the first field that needs attention.
  useEffect(() => {
    if (Object.values(errors).some(Boolean)) {
      document.querySelector('[aria-invalid="true"]')?.focus();
    }
  }, [errors]);

  const handleChange = (e) => {
    const { name } = e.target;
    const value = typingFilters[name] ? typingFilters[name](e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, documentProof: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = () => {
    const errs = {};
    (stepFields[step] || []).forEach((name) => {
      const msg = fieldRules[name](String(formData[name] ?? ''));
      if (msg) errs[name] = msg;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Check a single field when the user leaves it, so mistakes show before Continue.
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value || !fieldRules[name]) return;
    const msg = fieldRules[name](value);
    if (msg) setErrors(prev => ({ ...prev, [name]: msg }));
  };

  const goTo = (n) => {
    setErrors({});
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextStep = () => {
    if (validateStep()) goTo(Math.min(step + 1, steps.length));
  };

  const prevStep = () => goTo(Math.max(step - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validateStep()) return;
    setSending(true);
    try {
      const result = await api.submitAdmission({ ...formData, website: '' });
      setSubmittedData(result);
      window.scrollTo({ top: 0 });
    } catch (err) {
      // The server checks again; show what it found next to the fields it names.
      setErrors(err.fields || {});
      setFormError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Props shared by every text input, so ids, errors and aria stay in step.
  const fieldProps = (name) => ({
    id: name,
    name,
    value: formData[name],
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    className: `${inputBase} ${errors[name] ? 'border-red-600' : 'border-navy-deep/20'}`,
  });

  // SUCCESS ACKNOWLEDGEMENT SCREEN
  if (submittedData) {
    const rows = [
      ['Name', submittedData.fullName],
      ['Course', submittedData.courseName],
      ['Email', submittedData.email],
      ['Phone', submittedData.phone],
      ['PCM percentage', submittedData.pcmPercentage],
    ];
    return (
      <>
      <div className="flex min-h-[calc(100svh-5rem)] items-center bg-ivory py-8 text-ink print:hidden">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="grid gap-8 rounded-[2rem] border border-navy-deep/10 bg-white px-6 py-10 shadow-chunky-lg sm:px-12 sm:py-16 md:grid-cols-2 md:gap-12 print:rounded-none print:border-0 print:shadow-none">

            {/* What happens next */}
            <div className="flex flex-col">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-deep text-gold print:hidden">
                <Check className="h-6 w-6" />
              </span>
              <h1 className="mt-5 font-serif text-3xl font-semibold leading-tight text-navy-deep sm:text-4xl">Application submitted</h1>
              <p className="mt-3 text-base leading-relaxed text-ink/70">
                Our admissions desk will contact you within 24 hours to verify documents and slot you into a batch. Keep this receipt for your records.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-auto md:pt-6 print:hidden">
                <button
                  onClick={handlePrint}
                  className={`inline-flex items-center justify-center gap-2 rounded-full bg-navy-deep px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-light ${focusRing}`}
                >
                  <Printer className="h-4 w-4" /> Print receipt
                </button>
                <Link
                  href="/"
                  className={`inline-flex items-center justify-center rounded-full border border-navy-deep/25 px-6 py-3 text-sm font-semibold text-navy-deep transition-colors hover:border-gold hover:bg-gold-light ${focusRing}`}
                >
                  Back to home
                </Link>
              </div>
            </div>

            {/* Receipt details */}
            <div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-ivory px-5 py-4">
                <div>
                  <p className="text-sm text-ink/60">Registration number</p>
                  <p className="mt-0.5 font-serif text-2xl font-semibold tracking-wide text-navy-deep break-all">{submittedData.id}</p>
                </div>
                <span className="shrink-0 rounded-full bg-terracotta px-3.5 py-1 text-sm font-semibold text-navy-deep">{submittedData.status}</span>
              </div>

              <dl className="mt-3 divide-y divide-navy-deep/10">
                {rows.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-6 py-3.5">
                    <dt className="shrink-0 text-[15px] text-ink/60">{k}</dt>
                    <dd className="text-right text-[15px] font-medium text-navy-deep break-words">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-3 border-t border-navy-deep/10 pt-3 text-sm text-ink/55">Pacific Marine Academy, Nawalgarh Road, Sikar, Rajasthan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print-only acknowledgement: a plain A4 letter, no site chrome */}
      <ReceiptSheet data={submittedData} settings={settings} />
    </>
    );
  }

  const current = steps[step - 1];

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-16">

        {/* Progress rail: a voyage line on desktop, a compact bar on mobile */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-navy-deep sm:text-5xl">Apply for admission</h1>
            <p className="mt-4 max-w-sm text-[17px] leading-relaxed text-ink/70">
              Batch 2026-27. It takes about five minutes, and you can go back to any step.
            </p>

            <div className="mt-8 lg:hidden">
              <p className="text-sm font-semibold text-navy-deep">Step {step} of {steps.length}: {current.title}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-navy-deep/10">
                <div className="h-full rounded-full bg-navy-deep transition-all duration-300" style={{ width: `${(step / steps.length) * 100}%` }} />
              </div>
            </div>

            <ol className="mt-10 hidden lg:block">
              {steps.map((s, i) => {
                const n = i + 1;
                const done = n < step;
                const active = n === step;
                return (
                  <li key={s.title} className="relative pb-8 pl-14 last:pb-0">
                    {n < steps.length && (
                      <span className={`absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 ${done ? 'bg-navy-deep' : 'bg-navy-deep/15'}`} aria-hidden="true" />
                    )}
                    <span
                      className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                        done ? 'border-navy-deep bg-navy-deep text-gold' : active ? 'border-gold bg-gold text-navy-deep' : 'border-navy-deep/20 bg-ivory text-ink/50'
                      }`}
                      aria-hidden="true"
                    >
                      {done ? <Check className="h-5 w-5" /> : n}
                    </span>
                    <button
                      type="button"
                      onClick={() => done && goTo(n)}
                      disabled={!done}
                      aria-current={active ? 'step' : undefined}
                      className={`block text-left ${done ? 'cursor-pointer' : 'cursor-default'} ${focusRing}`}
                    >
                      <span className={`block font-serif text-xl font-semibold ${active ? 'text-navy-deep' : done ? 'text-navy-deep/80' : 'text-ink/45'}`}>{s.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <p className="mt-10 hidden max-w-xs text-[15px] leading-relaxed text-ink/60 lg:block">
              Stuck on a question? Call the academy and we will fill it in with you.
            </p>
          </div>
        </aside>

        {/* Form panel */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} noValidate className="rounded-[2rem] border border-navy-deep/10 bg-white p-6 shadow-chunky sm:p-10">
            <h2 className="font-serif text-3xl font-semibold text-navy-deep">{current.title}</h2>
            <p className="mt-2 text-[17px] leading-relaxed text-ink/65">{current.note}</p>

            <div className="mt-8 space-y-6">

              {/* STEP 1 */}
              {step === 1 && (
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Full name" name="fullName" error={errors.fullName}>
                    <input type="text" autoComplete="name" placeholder="Rohan Vikram Sharma" {...fieldProps('fullName')} />
                  </Field>
                  <Field label="Father's or guardian's name" name="fatherName" error={errors.fatherName}>
                    <input type="text" placeholder="Vikram Sharma" {...fieldProps('fatherName')} />
                  </Field>
                  <Field label="Email address" name="email" error={errors.email}>
                    <input type="email" autoComplete="email" placeholder="rohan@example.com" {...fieldProps('email')} />
                  </Field>
                  <Field label="Mobile or WhatsApp number" name="phone" error={errors.phone}>
                    <input type="tel" autoComplete="tel" placeholder="+91 98765 43210" {...fieldProps('phone')} />
                  </Field>
                  <Field label="Date of birth" name="dob" error={errors.dob}>
                    <input type="date" autoComplete="bday" {...fieldProps('dob')} />
                  </Field>
                  <Field label="Gender" name="gender">
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={`${inputBase} border-navy-deep/20`}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </Field>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Where are you in your studies?" name="qualification">
                      <select id="qualification" name="qualification" value={formData.qualification} onChange={handleChange} className={`${inputBase} border-navy-deep/20`}>
                        <option value="12th PCM Passed">12th standard passed (PCM)</option>
                        <option value="12th PCM Appearing">12th standard appearing (PCM)</option>
                        <option value="10th Passed (GP Rating)">10th standard passed (for GP Rating)</option>
                        <option value="Diploma Engineering">Diploma in Engineering</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="PCM aggregate percentage" name="pcmPercentage" error={errors.pcmPercentage} hint="Physics, Chemistry and Mathematics combined.">
                    <input type="text" inputMode="decimal" placeholder="78.5" {...fieldProps('pcmPercentage')} />
                  </Field>
                  <Field label="English percentage" name="englishPercentage" error={errors.englishPercentage} hint="From your 10th or 12th marksheet.">
                    <input type="text" inputMode="decimal" placeholder="82" {...fieldProps('englishPercentage')} />
                  </Field>
                  <Field label="City" name="city">
                    <input type="text" autoComplete="address-level2" placeholder="Sikar" {...fieldProps('city')} />
                  </Field>
                  <Field label="State" name="state">
                    <input type="text" autoComplete="address-level1" placeholder="Rajasthan" {...fieldProps('state')} />
                  </Field>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <>
                  <fieldset>
                    <legend className="mb-3 text-sm font-semibold text-navy-deep">Course</legend>
                    <div className="grid gap-3 sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-2">
                      {courses.map((c) => {
                        const selected = formData.courseName === c.title;
                        return (
                          <label
                            key={c.id}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${selected ? 'border-navy-deep bg-gold-light/50 ring-1 ring-navy-deep' : 'border-navy-deep/20 hover:border-gold'}`}
                          >
                            <input
                              type="radio"
                              name="courseName"
                              value={c.title}
                              checked={selected}
                              onChange={handleChange}
                              className="mt-1 h-4 w-4 shrink-0 accent-navy-deep"
                            />
                            <span>
                              <span className="block font-serif text-base font-semibold leading-snug text-navy-deep">{c.title}</span>
                              <span className="mt-0.5 block text-sm text-ink/60">
                                {[c.category, c.duration].filter(Boolean).join(', ')}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.courseName && <p role="alert" className="mt-2 text-sm font-medium text-red-700">{errors.courseName}</p>}
                  </fieldset>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Batch timing" name="batchPreference">
                      <select id="batchPreference" name="batchPreference" value={formData.batchPreference} onChange={handleChange} className={`${inputBase} border-navy-deep/20`}>
                        <option value="Morning Regular Batch">Morning, 9:00 am to 1:30 pm</option>
                        <option value="Afternoon Intensive">Afternoon, 2:00 pm to 6:30 pm</option>
                        <option value="Weekend Special">Weekend, Saturday and Sunday</option>
                        <option value="Online Hybrid Batch">Online hybrid</option>
                      </select>
                    </Field>
                    <fieldset>
                      <legend className="mb-1.5 text-sm font-semibold text-navy-deep">Do you need the academy hostel?</legend>
                      <div className="grid grid-cols-2 gap-3">
                        {[['Yes', 'Yes'], ['No', 'No']].map(([v, label]) => (
                          <label
                            key={v}
                            className={`flex h-12 cursor-pointer items-center justify-center rounded-xl border px-3 text-center text-sm font-semibold transition-colors ${formData.hostelRequired === v ? 'border-navy-deep bg-navy-deep text-white' : 'border-navy-deep/20 text-navy-deep hover:border-gold'}`}
                          >
                            <input type="radio" name="hostelRequired" value={v} checked={formData.hostelRequired === v} onChange={handleChange} className="sr-only" />
                            {label}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div>
                  <label
                    htmlFor="documentProof"
                    className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-navy-deep/25 bg-ivory px-6 py-12 text-center transition-colors hover:border-gold hover:bg-gold-light/40"
                  >
                    <Upload className="h-8 w-8 text-goldtext" />
                    <span className="text-lg font-semibold text-navy-deep">Choose your 10th or 12th marksheet</span>
                    <span className="text-sm text-ink/60">Photo or PDF. You can skip this and bring it to the academy.</span>
                  </label>
                  <input id="documentProof" type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="sr-only" />

                  {formData.documentProof && (
                    <div className="mt-5 flex items-center gap-4 rounded-2xl border border-navy-deep/10 bg-white p-4">
                      {formData.documentProof.startsWith('data:image') ? (
                        <img src={formData.documentProof} alt="Uploaded marksheet" className="h-20 w-20 rounded-lg object-cover" />
                      ) : (
                        <span className="flex h-20 w-20 items-center justify-center rounded-lg bg-ivory text-sm font-semibold text-navy-deep">PDF</span>
                      )}
                      <p className="flex items-center gap-2 text-[15px] font-semibold text-navy-deep"><Check className="h-5 w-5 text-seagreen" /> Marksheet added</p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5 */}
              {step === 5 && (
                <>
                  <div className="space-y-4">
                    <ReviewGroup title="Personal details" onEdit={() => goTo(1)} rows={[
                      ['Name', formData.fullName],
                      ['Father or guardian', formData.fatherName],
                      ['Email', formData.email],
                      ['Phone', formData.phone],
                      ['Date of birth', formData.dob],
                      ['Gender', formData.gender],
                    ]} />
                    <ReviewGroup title="Academics" onEdit={() => goTo(2)} rows={[
                      ['Studying', formData.qualification],
                      ['PCM percentage', formData.pcmPercentage],
                      ['English percentage', formData.englishPercentage],
                      ['Location', [formData.city, formData.state].filter(Boolean).join(', ')],
                    ]} />
                    <ReviewGroup title="Course and batch" onEdit={() => goTo(3)} rows={[
                      ['Course', formData.courseName],
                      ['Batch', formData.batchPreference],
                      ['Hostel', formData.hostelRequired === 'Yes' ? 'Needed' : 'Not needed'],
                      ['Marksheet', formData.documentProof ? 'Added' : 'Not added'],
                    ]} />
                  </div>

                  <label htmlFor="declaration" className="flex cursor-pointer items-start gap-3 text-[15px] leading-relaxed text-navy-deep">
                    <input type="checkbox" required id="declaration" className="mt-1 h-5 w-5 shrink-0 accent-navy-deep" />
                    <span>I confirm that the information I have given matches my certificates.</span>
                  </label>
                </>
              )}
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-navy-deep/10 pt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-light ${focusRing}`}
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              ) : <span />}

              {step < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className={`rounded-full bg-navy-deep px-9 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light ${focusRing}`}
                >
                  Continue
                </button>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  {formError && <p role="alert" className="text-sm font-medium text-red-700">{formError}</p>}
                  <button
                    type="submit"
                    disabled={sending}
                    className={`rounded-full bg-navy-deep px-9 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:cursor-wait disabled:opacity-60 ${focusRing}`}
                  >
                    {sending ? 'Submitting…' : 'Submit application'}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
