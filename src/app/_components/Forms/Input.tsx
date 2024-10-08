import React, { Dispatch, SetStateAction, useState } from "react";
import { FlareGasComposition, MbConfig, SmrConfig, StPressure, TraitBoundaries } from './_helpers';


export const Input: React.FC<{
  k: string;
  v: string | number;
  label: string;
  type: string;
  placeholder: string;
  setValue: Dispatch<SetStateAction<any>>;
}> = ({ k, v, type, label, placeholder, setValue }) => {
  return (
    <div className='flex gap-4 mb-2 max-sm:flex-col sm:items-center'>
      <label htmlFor={k}><strong>{label}</strong></label>
      <input
        className="p-2 rounded-lg"
        name={k}
        type={type}
        value={v}
        placeholder={placeholder}
        onChange={(e) => {
          const value = type === 'number' ? +e.target.value : e.target.value;
          setValue(value)
        }} />
    </div>
  )
}

export const ConfigNameInput: React.FC<{
  k: string;
  v: string;
  label: string
  setValue: Dispatch<SetStateAction<string>>;
}> = ({ k, v, label, setValue }) => {
  return (
    <Input
      k={k}
      type="text"
      v={v}
      label={label}
      placeholder="Config-xxx"
      setValue={setValue} />
  )
}

export const SmrConfInput: React.FC<{
  id: number;
  k: string;
  v: number;
  label: string
  setValue: Dispatch<SetStateAction<SmrConfig>>;
}> = ({ id, k, v, label, setValue }) => {
  return (
    <div className='flex gap-4 mb-2 flex-col'>
      <label htmlFor={k}><strong>{label}</strong></label>
      <input
        required
        pattern=""
        className="p-2 rounded-lg"
        name={'smr-' + k}
        type="number"
        value={v}
        onChange={(e) => {
          setValue((prev) => {
            prev[k as keyof SmrConfig] = +e.target.value
            return { ...prev }
          })
        }} />
    </div>
  )
}
export const MbConfInput: React.FC<{
  id: number;
  k: string;
  v: number;
  label: string
  setValue: Dispatch<SetStateAction<MbConfig>>;
}> = ({ id, k, v, label, setValue }) => {
  return (
    <div className='flex gap-4 mb-2 flex-col'>
      <label htmlFor={'mb-' + k}><strong>{label}</strong></label>
      <input
        required
        pattern=""
        className="p-2 rounded-lg"
        name={'mb-' + k}
        type="number"
        value={v}
        onChange={(e) => {
          setValue((prev) => {
            prev[k as keyof MbConfig] = +e.target.value
            return { ...prev }
          })
        }}
      />
    </div>
  )
}
export const CompositionConfInput: React.FC<{
  id: number;
  k: string;
  v: string;
  label: string
  setValue: Dispatch<SetStateAction<FlareGasComposition>>;
}> = ({ id, k, v, label, setValue }) => {
  const pattern = /^[0-9]+(\.[0-9]+)?$/
  const [error, setError] = useState('')
  return (
    <div className='flex gap-4 mb-2 flex-col'>
      <label htmlFor={'composition-' + k}><strong>{label}</strong></label>
      <input
        required
        pattern="[0-9]+(\.[0-9]+)?"
        className="p-2 rounded-lg"
        name={'composition-' + k}
        type="text"
        value={v}
        onChange={(e) => {
          if (!pattern.test(e.target.value)) {
            setError('Please enter a valid decimal number (e.g., 123.45)')
          } else {
            setError('')
          }
          setValue((prev) => {
            prev[k as keyof FlareGasComposition] = e.target.value
            return { ...prev }
          })
        }} />
      <p className="text-red-500">{error}</p>
    </div>
  )
}
export const BoundsConfInput: React.FC<{
  id: number;
  k: string;
  v: number;
  label: string
  setValue: Dispatch<SetStateAction<TraitBoundaries>>;
}> = ({ id, k, v, label, setValue }) => {
  return (
    <div className='flex gap-4 mb-2 flex-col'>
      <label htmlFor={'bounds-' + k}><strong>{label}</strong></label>
      <input
        required
        pattern=""
        className="p-2 rounded-lg"
        name={'bounds-' + k}
        type="number"
        value={v}
        onChange={(e) => {
          setValue((prev) => {
            prev[k as keyof TraitBoundaries] = +e.target.value
            return { ...prev }
          })
        }} />
    </div>
  )
}
export const StPressureConfInput: React.FC<{
  k: string;
  v: string;
  label: string
  setValue: Dispatch<SetStateAction<StPressure>>;
}> = ({ k, v, label, setValue }) => {
  const pattern = /^[0-9]+(\.[0-9]+)?$/
  const [error, setError] = useState('')
  return (
    <div className='flex gap-4 mb-2 flex-col'>
      <label htmlFor={'bounds-' + k}><strong>{label}</strong></label>
      <input
        required
        pattern="[0-9]+(\.[0-9]+)?"
        className="p-2 rounded-lg"
        name={'bounds-' + k}
        type="text"
        value={v}
        onChange={(e) => {
          if (!pattern.test(e.target.value)) {
            setError('Please enter a valid decimal number (e.g., 123.45)')
          } else {
            setError('')
          } if (!pattern.test(e.target.value)) {
            setError('Please enter a valid decimal number (e.g., 123.45)')
          } else {
            setError('')
          }
          setValue(e.target.value)
        }}
      />
      <p className="text-red-500">{error}</p>
    </div>
  )
}