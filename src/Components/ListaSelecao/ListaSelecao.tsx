import { useState, useEffect, useRef } from 'react'

interface ListaSelecaoProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
  id?: string
  className?: string
}

const ListaSelecao = ({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Selecione uma opção',
  label,
  required = false,
  id,
  className = ''
}: ListaSelecaoProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const listaSelecaoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listaSelecaoRef.current && !listaSelecaoRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: string) => {
    onChange(option)
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange('')
    setIsOpen(false)
  }

  return (
    <div className={className}>
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative" ref={listaSelecaoRef}>
        {required && <input type="hidden" value={value} required />}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 pr-8 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-left text-gray-900 dark:text-white text-sm sm:text-base"
        >
          {value || placeholder}
        </button>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg 
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            <div
              onClick={handleClear}
              className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer rounded-lg m-1"
            >
              {placeholder}
            </div>
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2.5 text-sm cursor-pointer rounded-lg m-1 ${
                  value === option
                    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ListaSelecao

