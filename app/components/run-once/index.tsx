import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  PlayIcon,
} from '@heroicons/react/24/solid'
import Select from '@/app/components/base/select'
import type { PromptConfig, VisionFile, VisionSettings } from '@/types/app'
import Button from '@/app/components/base/button'
import { DEFAULT_VALUE_MAX_LEN } from '@/config'
import TextGenerationImageUploader from '@/app/components/base/image-uploader/text-generation-image-uploader'

export type IRunOnceProps = {
  promptConfig: PromptConfig
  inputs: Record<string, any>
  onInputsChange: (inputs: Record<string, any>) => void
  onSend: () => void
  visionConfig: VisionSettings
  onVisionFilesChange: (files: VisionFile[]) => void
}
const RunOnce: FC<IRunOnceProps> = ({
  promptConfig,
  inputs,
  onInputsChange,
  onSend,
  visionConfig,
  onVisionFilesChange,
}) => {
  const { t } = useTranslation()

  const onClear = () => {
    const newInputs: Record<string, any> = {}
    // Also clear the static fields
    newInputs['source_text'] = ''
    newInputs['translated_text'] = ''
    // Clear dynamic fields
    promptConfig.prompt_variables.forEach((item) => {
      newInputs[item.key] = ''
    })
    onInputsChange(newInputs)
    // TODO: You might also want to clear vision files here if needed
    // onVisionFilesChange([])
  }

  // Helper function to handle input changes
  const handleInputChange = (key: string, value: any) => {
    onInputsChange({ ...inputs, [key]: value });
  };


  return (
    <div className="">
      <section>
        {/* input form */}
        <form>
          {/* ===== START: Add your static text areas here ===== */}
          <div className='w-full mt-4'>
            <label className='text-gray-900 text-sm font-medium'>Source Text</label> {/* You can use t('') for translation */}
            <div className='mt-2'>
              <textarea
                className="block w-full h-[104px] p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Enter source text..." // Add placeholder
                value={inputs['source_text'] || ''} // Use the key expected by the workflow
                onChange={(e) => handleInputChange('source_text', e.target.value)} // Update parent state
              />
            </div>
          </div>

          <div className='w-full mt-4'>
            <label className='text-gray-900 text-sm font-medium'>Translated Text</label> {/* You can use t('') for translation */}
            <div className='mt-2'>
              <textarea
                className="block w-full h-[104px] p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Enter translated text..." // Add placeholder
                value={inputs['translated_text'] || ''} // Use the key expected by the workflow
                onChange={(e) => handleInputChange('translated_text', e.target.value)} // Update parent state
              />
            </div>
          </div>
          {/* ===== END: Add your static text areas here ===== */}


          {/* Dynamic variables from promptConfig */}
          {promptConfig.prompt_variables.map(item => (
            <div className='w-full mt-4' key={item.key}>
              <label className='text-gray-900 text-sm font-medium'>{item.name}</label>
              <div className='mt-2'>
                {item.type === 'select' && (
                  <Select
                    className='w-full'
                    // Use handleInputChange helper
                    defaultValue={inputs[item.key]}
                    onSelect={(i) => handleInputChange(item.key, i.value)}
                    items={(item.options || []).map(i => ({ name: i, value: i }))}
                    allowSearch={false}
                    bgClassName='bg-gray-50'
                  />
                )}
                {item.type === 'string' && (
                  <input
                    type="text"
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 "
                    placeholder={`${item.name}${!item.required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
                    value={inputs[item.key] || ''}
                    // Use handleInputChange helper
                    onChange={(e) => handleInputChange(item.key, e.target.value)}
                    maxLength={item.max_length || DEFAULT_VALUE_MAX_LEN}
                  />
                )}
                {item.type === 'paragraph' && (
                  <textarea
                    className="block w-full h-[104px] p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 "
                    placeholder={`${item.name}${!item.required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
                    value={inputs[item.key] || ''}
                    // Use handleInputChange helper
                    onChange={(e) => handleInputChange(item.key, e.target.value)}
                  />
                )}
                {item.type === 'number' && (
                  <input
                    type="number"
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 "
                    placeholder={`${item.name}${!item.required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
                    value={inputs[item.key] || ''}
                    // Use handleInputChange helper
                    onChange={(e) => handleInputChange(item.key, e.target.value)}
                  />
                )}
              </div>
            </div>
          ))}
          {
            visionConfig?.enabled && (
              <div className="w-full mt-4">
                <div className="text-gray-900 text-sm font-medium">{t('common.imageUploader.imageUpload')}</div>
                <div className='mt-2'>
                  <TextGenerationImageUploader
                    settings={visionConfig}
                    onFilesChange={files => onVisionFilesChange(files.filter(file => file.progress !== -1).map(fileItem => ({
                      type: 'image',
                      transfer_method: fileItem.type,
                      url: fileItem.url,
                      upload_file_id: fileItem.fileId,
                    })))}
                  />
                </div>
              </div>
            )
          }
          {/* Separator line */}
          {(promptConfig.prompt_variables.length > 0 || visionConfig?.enabled) && ( // Add condition for visionConfig
            <div className='mt-4 h-[1px] bg-gray-100'></div>
          )}
          <div className='w-full mt-4'>
            <div className="flex items-center justify-between">
              <Button
                className='!h-8 !p-3'
                onClick={onClear}
                disabled={false} // You might want to disable based on responsing state later
              >
                <span className='text-[13px]'>{t('common.operation.clear')}</span>
              </Button>
              <Button
                type="primary"
                className='!h-8 !pl-3 !pr-4'
                onClick={onSend} // This calls the parent's handleSend function
                disabled={false} // You might want to disable based on responsing state later
              >
                <PlayIcon className="shrink-0 w-4 h-4 mr-1" aria-hidden="true" />
                <span className='text-[13px]'>{t('app.generation.run')}</span>
              </Button>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}
export default React.memo(RunOnce)