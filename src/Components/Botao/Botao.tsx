interface BotaoProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

const Botao = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  type = 'button',
  className = ''
}: BotaoProps) => {
  const baseStyles = 'font-semibold rounded-lg transition-colors'
  
  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50',
    outline: 'bg-transparent text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50'
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
    >
      {children}
    </button>
  )
}

export default Botao