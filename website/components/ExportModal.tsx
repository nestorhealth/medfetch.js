"use client"
import { useState } from "react"
import {
  Download,
  X,
  FileText,
  CheckCircle2,
  Database
} from "lucide-react"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: 'csv' | 'json') => void
  selectedCount: number
  totalCount: number
  tableName: string
}

export function ExportModal({ 
  isOpen, 
  onClose, 
  onExport, 
  selectedCount, 
  totalCount, 
  tableName 
}: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json'>('json')

  if (!isOpen) return null

  const handleExport = () => {
    onExport(selectedFormat)
    onClose()
  }

  const formatOptions = [
    {
      value: 'json' as const,
      label: 'JSON',
      description: 'Machine-readable format, preserves data types',
      icon: Database,
      extension: '.json',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      value: 'csv' as const,
      label: 'CSV',
      description: 'Spreadsheet-compatible, widely supported',
      icon: FileText,
      extension: '.csv',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md mx-4 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Download className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Export Data</h3>
              <p className="text-sm text-slate-400">{tableName} table</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Exporting:</span>
              <span className="text-white font-medium">
                {selectedCount > 0 ? `${selectedCount} selected` : `${totalCount} total`} rows
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Choose File Format
            </label>
            <div className="space-y-3">
              {formatOptions.map((format) => {
                const Icon = format.icon
                const isSelected = selectedFormat === format.value
                return (
                  <div
                    key={format.value}
                    className={`relative flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? `${format.bgColor} ${format.borderColor} ${format.color}`
                        : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                    }`}
                    onClick={() => setSelectedFormat(format.value)}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`p-2 rounded-lg ${isSelected ? format.bgColor : 'bg-slate-600/50'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? format.color : 'text-slate-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{format.label}</span>
                          <span className="text-xs opacity-70">{format.extension}</span>
                        </div>
                        <p className="text-xs mt-1 opacity-70">
                          {format.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className={`w-5 h-5 ${format.color}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 transition-colors rounded-lg hover:text-white hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-6 py-2 text-sm font-medium text-white transition-all rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export {selectedFormat.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
