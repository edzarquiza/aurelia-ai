import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import './InvoiceUpload.css'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface InvoiceUploadProps {
  selectedFile: File | null
  onFileSelected: (file: File) => void
  onClear: () => void
  onValidationError: (message: string) => void
  disabled: boolean
}

function InvoiceUpload({
  selectedFile,
  onFileSelected,
  onClear,
  onValidationError,
  disabled,
}: InvoiceUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateAndSelect = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      onValidationError('Only PDF files are supported. Please select a PDF invoice.')
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      onValidationError('File is too large. Maximum size is 10 MB.')
      return
    }

    onFileSelected(file)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    if (disabled) return

    const file = event.dataTransfer.files?.[0]
    if (file) {
      validateAndSelect(file)
    }
  }

  const handleBrowseChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      validateAndSelect(file)
    }
    event.target.value = ''
  }

  if (selectedFile) {
    return (
      <div className="invoice-upload invoice-upload--selected">
        <div className="invoice-file-info">
          <span className="invoice-file-name">{selectedFile.name}</span>
          <span className="invoice-file-size">{formatFileSize(selectedFile.size)}</span>
        </div>
        <button
          type="button"
          className="invoice-file-remove"
          onClick={onClear}
          disabled={disabled}
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <div
      className={`invoice-upload${isDragOver ? ' invoice-upload--drag-over' : ''}`}
      onDragOver={(event) => {
        event.preventDefault()
        if (!disabled) setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <p className="invoice-upload-primary">Drag &amp; drop PDF</p>
      <p className="invoice-upload-secondary">or</p>
      <button
        type="button"
        className="invoice-upload-browse"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        Browse files
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="invoice-upload-input"
        onChange={handleBrowseChange}
        disabled={disabled}
        aria-label="Select PDF invoice"
      />
    </div>
  )
}

export default InvoiceUpload
