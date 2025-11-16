interface BotaoProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'azul'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  isActive?: boolean
  disabled?: boolean
}

const Botao = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  type = 'button',
  className = '',
  isActive = false,
  disabled = false
}: BotaoProps) => {
  const baseStyles = 'font-semibold rounded-lg transition-colors'
  
  const variantStyles = {
    primary: disabled 
      ? 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
      : 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: disabled
      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-2 border-gray-300 dark:border-gray-600 cursor-not-allowed'
      : 'bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50',
    outline: disabled
      ? 'bg-transparent text-gray-400 dark:text-gray-500 border-2 border-gray-300 dark:border-gray-600 cursor-not-allowed'
      : 'bg-transparent text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50',
    azul: disabled
      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-2 border-gray-300 dark:border-gray-600 cursor-not-allowed'
      : isActive 
        ? 'bg-[#4169E1] text-white border-2 border-[#4169E1]'
        : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-[#4169E1]'
  }
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm',
    md: 'px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base',
    lg: 'px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg'
  }
  
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`
  
  return (
    <button 
      type={type}
      onClick={onClick}
      className={combinedStyles}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Botao

