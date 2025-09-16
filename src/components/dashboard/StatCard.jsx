import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const StatCard = forwardRef(({ 
  title, 
  value, 
  icon: Icon, 
  gradient = 'blue',
  trend,
  size = 'medium',
  className = '',
  onClick,
  ...props 
}, ref) => {
  // Predefined gradient themes
  const gradientThemes = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-blue-200',
      iconBg: 'bg-blue-500',
      titleColor: 'text-blue-700',
      valueColor: 'text-blue-900',
      trendPositive: 'text-blue-600',
      trendNegative: 'text-red-500'
    },
    green: {
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-500',
      titleColor: 'text-emerald-700',
      valueColor: 'text-emerald-900',
      trendPositive: 'text-emerald-600',
      trendNegative: 'text-red-500'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      border: 'border-purple-200',
      iconBg: 'bg-purple-500',
      titleColor: 'text-purple-700',
      valueColor: 'text-purple-900',
      trendPositive: 'text-purple-600',
      trendNegative: 'text-red-500'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
      border: 'border-orange-200',
      iconBg: 'bg-orange-500',
      titleColor: 'text-orange-700',
      valueColor: 'text-orange-900',
      trendPositive: 'text-orange-600',
      trendNegative: 'text-red-500'
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100',
      border: 'border-red-200',
      iconBg: 'bg-red-500',
      titleColor: 'text-red-700',
      valueColor: 'text-red-900',
      trendPositive: 'text-red-600',
      trendNegative: 'text-red-700'
    },
    indigo: {
      bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      border: 'border-indigo-200',
      iconBg: 'bg-indigo-500',
      titleColor: 'text-indigo-700',
      valueColor: 'text-indigo-900',
      trendPositive: 'text-indigo-600',
      trendNegative: 'text-red-500'
    },
    teal: {
      bg: 'bg-gradient-to-br from-teal-50 to-teal-100',
      border: 'border-teal-200',
      iconBg: 'bg-teal-500',
      titleColor: 'text-teal-700',
      valueColor: 'text-teal-900',
      trendPositive: 'text-teal-600',
      trendNegative: 'text-red-500'
    },
    pink: {
      bg: 'bg-gradient-to-br from-pink-50 to-pink-100',
      border: 'border-pink-200',
      iconBg: 'bg-pink-500',
      titleColor: 'text-pink-700',
      valueColor: 'text-pink-900',
      trendPositive: 'text-pink-600',
      trendNegative: 'text-red-500'
    }
  }

  // Size configurations
  const sizeConfig = {
    small: {
      card: 'p-3 sm:p-4',
      icon: 'w-8 h-8',
      iconContainer: 'w-10 h-10',
      title: 'text-xs sm:text-sm',
      value: 'text-lg sm:text-xl',
      trend: 'text-xs',
      spacing: 'ml-2 sm:ml-3'
    },
    medium: {
      card: 'p-4 sm:p-6',
      icon: 'w-5 h-5 sm:w-6 sm:h-6',
      iconContainer: 'w-10 h-10 sm:w-12 sm:h-12',
      title: 'text-xs sm:text-sm',
      value: 'text-lg sm:text-2xl',
      trend: 'text-xs sm:text-sm',
      spacing: 'ml-3 sm:ml-4'
    },
    large: {
      card: 'p-6 sm:p-8',
      icon: 'w-6 h-6 sm:w-8 sm:h-8',
      iconContainer: 'w-12 h-12 sm:w-16 sm:h-16',
      title: 'text-sm sm:text-base',
      value: 'text-2xl sm:text-3xl',
      trend: 'text-sm',
      spacing: 'ml-4 sm:ml-6'
    }
  }

  const theme = gradientThemes[gradient] || gradientThemes.blue
  const sizes = sizeConfig[size] || sizeConfig.medium

  // Animation variants
  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hover: {
      y: -2,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  }

  const iconVariants = {
    initial: { 
      scale: 0,
      rotate: -180
    },
    animate: { 
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.2,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2
      }
    }
  }

  const valueVariants = {
    initial: { 
      opacity: 0,
      x: -20
    },
    animate: { 
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  const trendVariants = {
    initial: { 
      opacity: 0,
      scale: 0.8
    },
    animate: { 
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.4,
        duration: 0.3
      }
    }
  }

  // Trend icon component
  const TrendIcon = ({ trend }) => {
    if (!trend) return null

    const isPositive = trend.direction === 'up'
    const trendColor = isPositive ? theme.trendPositive : theme.trendNegative

    return (
      <motion.div 
        variants={trendVariants}
        className={`flex items-center ${sizes.trend} ${trendColor} font-medium`}
      >
        <svg 
          className={`w-3 h-3 mr-1 ${isPositive ? 'transform rotate-0' : 'transform rotate-180'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" 
            clipRule="evenodd" 
          />
        </svg>
        {trend.value}
        {trend.period && <span className="ml-1 opacity-75">{trend.period}</span>}
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap={onClick ? "tap" : undefined}
      className={`
        card cursor-pointer select-none
        ${theme.bg} ${theme.border}
        ${sizes.card}
        transition-all duration-200 ease-in-out
        hover:shadow-lg hover:shadow-black/5
        active:shadow-sm
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-center">
        <motion.div 
          variants={iconVariants}
          className={`
            ${theme.iconBg} rounded-xl flex items-center justify-center
            ${sizes.iconContainer}
            shadow-sm
          `}
        >
          {Icon && (
            <Icon className={`text-white ${sizes.icon}`} />
          )}
        </motion.div>
        
        <div className={`flex-1 min-w-0 ${sizes.spacing}`}>
          <motion.p 
            variants={valueVariants}
            className={`font-medium ${theme.titleColor} ${sizes.title} truncate`}
          >
            {title}
          </motion.p>
          <motion.p 
            variants={valueVariants}
            className={`font-bold ${theme.valueColor} ${sizes.value} leading-tight`}
          >
            {value}
          </motion.p>
          {trend && <TrendIcon trend={trend} />}
        </div>
      </div>
    </motion.div>
  )
})

StatCard.displayName = 'StatCard'

export default StatCard