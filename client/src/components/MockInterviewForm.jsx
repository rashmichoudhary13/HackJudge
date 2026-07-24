import { useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileUp, X } from 'lucide-react'
import { auth } from '../context/firebase.js'

const ACCEPT_DECK =
  '.pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation'

const initialState = {
  projectTitle: '',
  problemStatement: '',
  solutionDescription: '',
  techStack: '',
  keyFeature: '',
  judge: 'Hackathon',
  duration: 5
}

const categories = ["Technical", "Product", "Business", "AI/ML", "Hackathon"];

export default function MockInterviewForm({ className = '' }) {
  const navigate = useNavigate()
  const formId = useId()
  const fileInputRef = useRef(null)
  const [values, setValues] = useState(initialState)
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const requiredFields = [
    'projectTitle',
    'problemStatement',
    'solutionDescription',
    'techStack',
    'keyFeature',
  ]

  function validateForm() {
    const emptyField = requiredFields.find(
      (field) => !values[field]?.trim()
    )
    if (emptyField) {
      setSubmitError('Please fill in all required fields before continuing.')
      return false
    }
    setSubmitError('')
    return true
  }

  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0]
    setFileError('')
    if (!f) {
      setFile(null)
      return
    }
    const ok =
      f.type === 'application/pdf' ||
      f.type === 'application/vnd.ms-powerpoint' ||
      f.type ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      /\.(pdf|ppt|pptx)$/i.test(f.name)
    if (!ok) {
      setFileError('Please upload a PDF or PowerPoint file (.pdf, .ppt, .pptx).')
      e.target.value = ''
      setFile(null)
      return
    }
    setFile(f)
  }

  function clearFile() {
    setFile(null)
    setFileError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function uploadFile() {
    if (!file) return undefined

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET_NAME);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        console.error("Failed to upload the file");
      }

      const cloudinaryData = await response.json();

      return cloudinaryData.secure_url;
    } catch (err) {
      console.log("File Error: ", err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    if (!auth.currentUser) {
      setSubmitError('You must be logged in to start a mock interview.')
      return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      const token = await auth.currentUser.getIdToken()

      const deckUrl = file ? await uploadFile() : "";

      const payload = { ...values, deckUrl }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/project/details`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        setSubmitError('Failed to save project details. Please try again.')
        return
      }

      const data = await response.json()
      console.log("Frontend data: ", data.message);

      navigate('/interview-processing', {
        state: {
          projectId: data.projectId,
          projectTitle: values.projectTitle.trim(),
        },
      })
    } catch (err) {
      console.log('Form error: ', err)
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-violet-500/30 transition placeholder:text-slate-400 focus:border-violet-500/60 focus:bg-white focus:ring-2'
  const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700'

  return (
    <form
      className={`space-y-6 ${className}`}
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor={`${formId}-title`} className={labelClass}>
          Project title <span className="text-red-400">*</span>
        </label>
        <input
          id={`${formId}-title`}
          name="projectTitle"
          type="text"
          required
          value={values.projectTitle}
          onChange={handleChange}
          className={inputClass}
          placeholder="e.g. EcoRoute — carbon-aware transit"
        />
      </div>

      <div>
        <label htmlFor={`${formId}-problem`} className={labelClass}>
          Problem statement <span className="text-red-400">*</span>
        </label>
        <textarea
          id={`${formId}-problem`}
          name="problemStatement"
          required
          rows={4}
          value={values.problemStatement}
          onChange={handleChange}
          className={`${inputClass} resize-y min-h-[100px]`}
          placeholder="What pain point or gap are you solving?"
        />
      </div>

      <div>
        <label htmlFor={`${formId}-solution`} className={labelClass}>
          Solution description <span className="text-red-400">*</span>
        </label>
        <textarea
          id={`${formId}-solution`}
          name="solutionDescription"
          required
          rows={4}
          value={values.solutionDescription}
          onChange={handleChange}
          className={`${inputClass} resize-y min-h-[100px]`}
          placeholder="How does your product or demo address the problem?"
        />
      </div>

      <div>
        <label htmlFor={`${formId}-stack`} className={labelClass}>
          Tech stack <span className="text-red-400">*</span>
        </label>
        <input
          id={`${formId}-stack`}
          name="techStack"
          type="text"
          required
          value={values.techStack}
          onChange={handleChange}
          className={inputClass}
          placeholder="e.g. React, TypeScript, FastAPI, PostgreSQL"
        />
      </div>

      <div>
        <label htmlFor={`${formId}-feature`} className={labelClass}>
          Key feature <span className="text-red-400">*</span>
        </label>
        <textarea
          id={`${formId}-feature`}
          name="keyFeature"
          required
          rows={3}
          value={values.keyFeature}
          onChange={handleChange}
          className={`${inputClass} resize-y min-h-[80px]`}
          placeholder="The one capability judges should remember from your pitch"
        />
      </div>

      <div>
        <label htmlFor={`${formId}-judge`} className={labelClass}>
          Select Judge <span className="text-red-400">*</span>
        </label>

        <div className='flex flex-col gap-2 md:flex-row justify-between mb-5'>
          {categories.map((category) => (
            <div key={category}>
              <input
                type="radio"
                name="judge"
                value={category}
                checked={values.judge === category}
                onChange={handleChange}
              />

              <label> {category === "Hackathon" ? "Default" : category} </label>
            </div>
          ))}
        </div>

        <div>
          <label htmlFor={`${formId}-duration`} className='pr-5 text-sm font-medium text-slate-700'>
            Interview Duration:
          </label>
          <select name="duration" value={values.duration} onChange={handleChange} className="rounded-lg px-2 py-2 border border-slate-200 bg-slate-50 outline-none ring-violet-500/30 transition focus:border-violet-500/60 focus:bg-white focus:ring-2">
            <option value="3">3 min</option>
            <option value="5">5 min</option>
            <option value="15">15 min</option>
            <option value="30">30 min</option>
          </select>
        </div>

      </div>

      <div>
        <span className={labelClass}>Deck upload (PDF or PowerPoint)</span>
        <p className="mb-2 text-xs text-slate-500">
          .pdf, .ppt, or .pptx — optional if you will share screen live instead.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label
            htmlFor={`${formId}-deck`}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-650 transition hover:border-violet-500/40 hover:bg-slate-100 sm:min-w-[200px]"
          >
            <FileUp className="h-4 w-4 text-violet-600" aria-hidden />
            Choose file
          </label>
          <input
            id={`${formId}-deck`}
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_DECK}
            onChange={handleFileChange}
            className="sr-only"
          />
          {file && (
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={clearFile}
                className="shrink-0 rounded-lg p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        {fileError && (
          <p className="mt-2 text-sm text-red-400" role="alert">
            {fileError}
          </p>
        )}
      </div>

      {submitError && (
        <p className="text-sm text-red-400" role="alert">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Saving…' : 'Start mock interview'}
      </button>
    </form>
  )
}
