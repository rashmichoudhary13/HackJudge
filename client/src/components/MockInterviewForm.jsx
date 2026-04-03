import { useId, useRef, useState } from 'react'
import { FileUp, X } from 'lucide-react'

const ACCEPT_DECK =
  '.pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation'

const initialState = {
  projectTitle: '',
  problemStatement: '',
  solutionDescription: '',
  techStack: '',
  keyFeature: '',
  githubLink: '',
}

export default function MockInterviewForm({ className = '' }) {
  const formId = useId()
  const fileInputRef = useRef(null)
  const [values, setValues] = useState(initialState)
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')

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

  function handleSubmit(e) {
    e.preventDefault()
    // Wire to API / session later
    const payload = { ...values, deckFile: file }
    console.log('Mock interview form:', payload)
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-violet-500/30 transition placeholder:text-slate-500 focus:border-violet-500/40 focus:ring-2'
  const labelClass = 'mb-1.5 block text-sm font-medium text-slate-300'

  return (
    <form
      className={`space-y-6 ${className}`}
      onSubmit={handleSubmit}
      noValidate
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
        <label htmlFor={`${formId}-github`} className={labelClass}>
          GitHub link <span className="text-slate-500">(optional)</span>
        </label>
        <div className="relative">
          <div
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            aria-hidden
          />
          <input
            id={`${formId}-github`}
            name="githubLink"
            type="url"
            inputMode="url"
            value={values.githubLink}
            onChange={handleChange}
            className={`${inputClass} pl-10`}
            placeholder="https://github.com/org/repo"
          />
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
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-slate-950/50 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-violet-500/40 hover:bg-slate-900/80 sm:min-w-[200px]"
          >
            <FileUp className="h-4 w-4 text-violet-400" aria-hidden />
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
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-300">
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={clearFile}
                className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
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

      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110"
      >
        Start mock interview
      </button>
    </form>
  )
}
