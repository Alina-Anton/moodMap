import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface BaseInputProps {
  label: string
}

interface TextInputProps extends BaseInputProps, InputHTMLAttributes<HTMLInputElement> {
  multiline?: false
}

interface TextAreaInputProps
  extends BaseInputProps,
    TextareaHTMLAttributes<HTMLTextAreaElement> {
  multiline: true
}

type InputProps = TextInputProps | TextAreaInputProps

export function Input(props: InputProps) {
  const { label, multiline, ...rest } = props

  return (
    <label className="field">
      <span>{label}</span>
      {multiline ? (
        <textarea {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
    </label>
  )
}
