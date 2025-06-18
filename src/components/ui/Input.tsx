import React from 'react';
import { useTheme } from '../../hooks/useTheme';

interface InputProps {
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ElementType;
    className?: string;
    [key: string]: any;
}

const Input: React.FC<InputProps> = ({
                                         type = "text",
                                         placeholder,
                                         value,
                                         onChange,
                                         icon: Icon,
                                         className = "",
                                         ...props
                                     }) => {
    const { themeClasses } = useTheme();

    return (
        <div className="relative">
            {Icon && (
                <Icon
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeClasses.textSubtle}`}
                />
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`
          w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 
          ${themeClasses.input} 
          rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent 
          transition-all
          ${className}
        `}
                {...props}
            />
        </div>
    );
};

export default Input;