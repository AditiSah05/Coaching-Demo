"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Anchor, CheckCircle2, ArrowRight, ArrowLeft, Upload, Printer, FileCheck, Shield, HelpCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

export const AdmissionForm = () => {
  const { courses, api } = useData();
  const searchParams = useSearchParams();
  const preSelectedCourse = searchParams.get('course') || '';

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    if (step === 1) {
      if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
      if (!formData.email.trim()) errs.email = 'Email address is required';
      if (!formData.phone.trim()) errs.phone = 'Phone number is required';
      if (!formData.dob) errs.dob = 'Date of birth is required';
      if (!formData.fatherName.trim()) errs.fatherName = "Father's name is required";
    } else if (step === 2) {
      if (!formData.pcmPercentage) errs.pcmPercentage = 'PCM percentage is required';
      if (!formData.englishPercentage) errs.englishPercentage = 'English percentage is required';
    } else if (step === 3) {
      if (!formData.courseName) errs.courseName = 'Please select a course';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      const selectedCourseObj = courses.find(c => c.title === formData.courseName);
      const submissionPayload = {
        ...formData,
        courseId: selectedCourseObj?.id || 'course-custom'
      };
      const result = api.submitAdmission(submissionPayload);
      setSubmittedData(result);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // SUCCESS ACKNOWLEDGEMENT SCREEN
  if (submittedData) {
    return (
      <div className="py-16 bg-ivory text-ink min-h-screen">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-seagreen shadow-2xl text-center space-y-6 print:border-none print:shadow-none">
            
            <div className="w-20 h-20 bg-seagreen/20 text-seagreen rounded-full flex items-center justify-center mx-auto border border-seagreen">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="badge-solid bg-seagreen text-white mb-2">Application Submitted Successfully</span>
              <h1 className="font-serif text-3xl font-extrabold text-navy-deep">Admission Acknowledgement Receipt</h1>
              <p className="text-xs text-ink/70 mt-1">Pacific Marine Academy • Nawalgarh Road, Sikar, Rajasthan</p>
            </div>

            <div className="bg-navy-deep text-white p-6 rounded-2xl text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-sea-blue/20 pb-2">
                <span className="text-sea-blue">Registration Reference No:</span>
                <span className="text-gold font-bold">{submittedData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ivory/70">Cadet Full Name:</span>
                <span className="font-bold">{submittedData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ivory/70">Selected Course:</span>
                <span className="font-bold text-gold">{submittedData.courseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ivory/70">Contact Email & Phone:</span>
                <span>{submittedData.email} | {submittedData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ivory/70">10+2 PCM %:</span>
                <span>{submittedData.pcmPercentage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ivory/70">Application Status:</span>
                <span className="bg-gold text-navy-deep font-bold px-2 py-0.5 rounded text-[10px]">{submittedData.status}</span>
              </div>
            </div>

            <p className="text-xs text-ink/70 italic">
              Please save or print this receipt. Our Master Mariner admissions desk will contact you within 24 hours for document verification and batch slotting.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 print:hidden">
              <button
                onClick={handlePrint}
                className="w-full sm:w-auto bg-navy-deep hover:bg-navy-light text-gold font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-xs uppercase"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Acknowledgement</span>
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto bg-terracotta text-navy-deep font-bold px-6 py-3 rounded-xl text-xs uppercase text-center"
              >
                Back To Home
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory text-ink min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-8">
          <span className="badge-solid bg-terracotta/20 text-goldtext mb-2">Modulo di Ammissione</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-deep">
            Online Cadet Admission Portal
          </h1>
          <p className="text-xs text-ink/70 mt-1">Batch 2026-27 • Maritime Entrance & Sponsorship Preparation</p>
        </div>

        {/* Multi-step Progress Bar */}
        <div className="bg-white p-4 rounded-2xl border border-navy-deep/10 shadow-sm mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-navy-deep mb-2">
            <span>Step {step} of 5</span>
            <span className="text-goldtext">
              {step === 1 && '1. Personal Info'}
              {step === 2 && '2. Academic Qualifications'}
              {step === 3 && '3. Course & Batch'}
              {step === 4 && '4. Documents'}
              {step === 5 && '5. Final Review'}
            </span>
          </div>
          <div className="w-full bg-ivory h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-terracotta h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-navy-deep/10 shadow-chunky">
          
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* STEP 1: PERSONAL DETAILS */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-navy-deep border-b pb-2 flex items-center gap-2">
                  <Anchor className="w-5 h-5 text-goldtext" /> Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-deep mb-1">Full Name (As per 10th Certificate)*</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Rohan Vikram Sharma"
                      className={`w-full p-3 text-xs rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-navy-deep/20'} focus:outline-none focus:border-terracotta`}
                    />
                    {errors.fullName && <p className="text-[10px] text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-deep mb-1">Father's / Guardian Name*</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      placeholder="e.g. Vikram Sharma"
                      className={`w-full p-3 text-xs rounded-xl border ${errors.fatherName ? 'border-red-500' : 'border-navy-deep/20'} focus:outline-none focus:border-terracotta`}
                    />
                    {errors.fatherName && <p className="text-[10px] text-red-500 mt-1">{errors.fatherName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-deep mb-1">Email Address*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="rohan@example.com"
                      className={`w-full p-3 text-xs rounded-xl border ${errors.email ? 'border-red-500' : 'border-navy-deep/20'} focus:outline-none focus:border-terracotta`}
                    />
                    {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-deep mb-1">Mobile / WhatsApp Number*</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={`w-full p-3 text-xs rounded-xl border ${errors.phone ? 'border-red-500' : 'border-navy-deep/20'} focus:outline-none focus:border-terracotta`}
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-deep mb-1">Date of Birth*</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className={`w-full p-3 text-xs rounded-xl border ${errors.dob ? 'border-red-500' : 'border-navy-deep/20'} focus:outline-none focus:border-terracotta`}
                    />
                    {errors.dob && <p className="text-[10px] text-red-500 mt-1">{errors.dob}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-deep mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-3 text-xs rounded-xl border border-navy-deep/20 focus:outline-none focus:border-terracotta"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ACADEMIC DETAILS */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-navy-deep border-b pb-2 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-goldtext" /> Academic Eligibility & Marks
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-deep mb-1">Educational Qualification Status</label>
                    <select
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full p-3 text-xs rounded-xl border border-navy-deep/20 focus:outline-none"
                    >
                      <option value="12th PCM Passed">12th Standard Passed (PCM)</option>
                      <option value="12th PCM Appearing">12th Standard Appearing (PCM)</option>
                      <option value="10th Passed (GP Rating)">10th Standard Passed (For GP Rating)</option>
                      <option value="Diploma Engineering">Diploma in Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-deep mb-1">Physics, Chemistry, Math (PCM) Aggregate %*</label>
                    <input
                      type="text"
                      name="pcmPercentage"
                      value={formData.pcmPercentage}
                      onChange={handleChange}
                      placeholder="e.g. 78.5%"
                      className={`w-full p-3 text-xs rounded-xl border ${errors.pcmPercentage ? 'border-red-500' : 'border-navy-deep/20'}`}
                    />
                    {errors.pcmPercentage && <p className="text-[10px] text-red-500 mt-1">{errors.pcmPercentage}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-deep mb-1">English Marks % (10th or 12th)*</label>
                    <input
                      type="text"
                      name="englishPercentage"
                      value={formData.englishPercentage}
                      onChange={handleChange}
                      placeholder="e.g. 82.0%"
                      className={`w-full p-3 text-xs rounded-xl border ${errors.englishPercentage ? 'border-red-500' : 'border-navy-deep/20'}`}
                    />
                    {errors.englishPercentage && <p className="text-[10px] text-red-500 mt-1">{errors.englishPercentage}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-deep mb-1">City & State</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="p-3 text-xs rounded-xl border border-navy-deep/20"
                      />
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="p-3 text-xs rounded-xl border border-navy-deep/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: COURSE & BATCH */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-navy-deep border-b pb-2 flex items-center gap-2">
                  <Anchor className="w-5 h-5 text-goldtext" /> Course & Batch Selection
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-deep mb-1">Select Program / Course*</label>
                    <select
                      name="courseName"
                      value={formData.courseName}
                      onChange={handleChange}
                      className="w-full p-3 text-xs rounded-xl border border-navy-deep/20 focus:outline-none focus:border-terracotta font-semibold text-navy-deep"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.title}>
                          {c.title} ({c.fee} • {c.duration})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy-deep mb-1">Preferred Batch Timing</label>
                      <select
                        name="batchPreference"
                        value={formData.batchPreference}
                        onChange={handleChange}
                        className="w-full p-3 text-xs rounded-xl border border-navy-deep/20"
                      >
                        <option value="Morning Regular Batch">Morning Regular Batch (09:00 AM - 01:30 PM)</option>
                        <option value="Afternoon Intensive">Afternoon Intensive Batch (02:00 PM - 06:30 PM)</option>
                        <option value="Weekend Special">Weekend Special (Sat & Sun)</option>
                        <option value="Online Hybrid Batch">Online Hybrid Interactive Batch</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-deep mb-1">Academy Hostel Required?</label>
                      <select
                        name="hostelRequired"
                        value={formData.hostelRequired}
                        onChange={handleChange}
                        className="w-full p-3 text-xs rounded-xl border border-navy-deep/20"
                      >
                        <option value="Yes">Yes - Require Hostel & Mess Facility</option>
                        <option value="No">No - Day Scholar</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: DOCUMENTS UPLOAD PREVIEW */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-navy-deep border-b pb-2 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-goldtext" /> Marksheet / Photo Document Preview
                </h3>

                <div className="border border-dashed border-sea-blue/40 p-6 rounded-2xl bg-ivory text-center space-y-3">
                  <Upload className="w-8 h-8 text-sea-blue mx-auto" />
                  <p className="text-xs font-bold text-navy-deep">Upload 10th / 12th Marksheet Proof (Optional)</p>
                  <p className="text-[10px] text-ink/60">Stores preview securely in your application record</p>
                  
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="text-xs mx-auto text-navy-deep file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sea-blue file:text-navy-deep hover:file:bg-sea-dark"
                  />

                  {formData.documentProof && (
                    <div className="mt-4 p-2 bg-white rounded-xl border inline-block max-w-xs">
                      <span className="text-[10px] text-seagreen font-bold block mb-1">Document Uploaded Successfully ✓</span>
                      {formData.documentProof.startsWith('data:image') && (
                        <img src={formData.documentProof} alt="Document Proof" className="h-24 mx-auto rounded object-cover" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: FINAL REVIEW */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-navy-deep border-b pb-2">
                  Review & Confirm Application Details
                </h3>

                <div className="bg-ivory p-4 rounded-2xl border border-navy-deep/10 text-xs space-y-2">
                  <p><strong>Name:</strong> {formData.fullName}</p>
                  <p><strong>Father's Name:</strong> {formData.fatherName}</p>
                  <p><strong>Contact:</strong> {formData.email} | {formData.phone}</p>
                  <p><strong>Academic PCM:</strong> {formData.pcmPercentage} | English: {formData.englishPercentage}</p>
                  <p><strong>Selected Program:</strong> <span className="text-goldtext font-bold">{formData.courseName}</span></p>
                  <p><strong>Batch & Hostel:</strong> {formData.batchPreference} | Hostel: {formData.hostelRequired}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-navy-deep font-semibold">
                  <input type="checkbox" required defaultChecked id="declaration" className="w-4 h-4 text-goldtext rounded" />
                  <label htmlFor="declaration">I hereby declare that all information provided is accurate as per my certificates.</label>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-6 border-t flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-navy-light/20 hover:bg-navy-light/40 text-navy-deep font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>
              ) : <div />}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-terracotta hover:bg-terracotta-hover text-navy-deep font-bold px-8 py-3 rounded-xl text-xs flex items-center gap-1.5 uppercase shadow-terracotta"
                >
                  <span>Continue Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-seagreen hover:bg-seagreen/90 text-white font-bold px-8 py-3 rounded-xl text-xs uppercase shadow-lg flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Application</span>
                </button>
              )}
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
