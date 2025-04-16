
'use client'
import React, { useState } from 'react'

const WORKFLOW_ID = 'TDRz4MRX45PyMsFk'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/v1'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ''

export default function Page() {
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [targetFile, setTargetFile] = useState<File | null>(null)
  const [resultText, setResultText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!sourceFile || !targetFile) return
    setLoading(true)
    const formData = new FormData()
    formData.append('source_text', sourceFile)
    formData.append('translated_text', targetFile)

    try {
      const res = await fetch(`${API_URL}/workflows/${WORKFLOW_ID}/execute`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`
        },
        body: formData,
      })

      const data = await res.json()
      setResultText(data?.result?.text || '未找到对齐结果。')
    } catch (err) {
      console.error('对齐失败:', err)
      setResultText('请求失败。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">双语段落对齐工具</h1>
      <div className="mb-4">
        <label className="block font-medium mb-1">原文文件</label>
        <input type="file" accept=".txt,.docx,.pdf" onChange={(e) => setSourceFile(e.target.files?.[0] || null)} />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">译文文件</label>
        <input type="file" accept=".txt,.docx,.pdf" onChange={(e) => setTargetFile(e.target.files?.[0] || null)} />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!sourceFile || !targetFile || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '对齐中...' : '开始对齐'}
      </button>

      {resultText && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">对齐结果</h2>
          <div className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded">
            <div dangerouslySetInnerHTML={{ __html: resultText }} />
          </div>
        </div>
      )}
    </main>
  )
}
