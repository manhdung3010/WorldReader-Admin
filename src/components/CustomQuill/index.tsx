// components/CustomQuill.tsx
import { useEffect, useRef } from 'react'
import 'quill/dist/quill.snow.css' // Theme Snow (có toolbar)

// Interface cho props của CustomQuill
interface CustomQuillProps {
  value?: string
  onChange: (value: string) => void
  [key: string]: any // Cho phép thêm các props khác
}

const CustomQuill: React.FC<CustomQuillProps> = ({ value, onChange, placeholder, ...props }) => {
  const quillRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<any>(null) // Dùng any hoặc import kiểu từ @types/quill nếu cần

  useEffect(() => {
    let isMounted = true

    import('quill').then(QuillModule => {
      if (!isMounted || !quillRef.current || editorRef.current) return

      const Quill = QuillModule.default

      // Đăng ký module công thức (nếu cần)
      const Formula: any = Quill.import('formats/formula')
      Quill.register(Formula, true)

      // Cấu hình Quill với đầy đủ tính năng
      editorRef.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block'],
            ['link', 'image', 'video', 'formula'],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
            [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
            [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
            [{ direction: 'rtl' }], // text direction

            [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],

            ['clean']
          ],
          history: {
            delay: 1000,
            maxStack: 500,
            userOnly: false
          } // Module lịch sử (undo/redo)
        },
        placeholder: placeholder
      })

      // Cập nhật giá trị ban đầu từ Controller
      if (value) {
        editorRef.current.root.innerHTML = value
      }

      // Lắng nghe sự thay đổi trong editor
      editorRef.current.on('text-change', () => {
        const content = editorRef.current.root.innerHTML
        onChange(content)
      })
    })

    return () => {
      isMounted = false
    }
  }, [onChange, placeholder, value])

  // Đồng bộ giá trị từ Controller
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.root.innerHTML) {
      editorRef.current.root.innerHTML = value || ''
    }
  }, [value])

  return <div ref={quillRef} {...props} />
}

export default CustomQuill
