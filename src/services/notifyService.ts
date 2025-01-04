// src/services/notifyService.ts
import { createApp, h } from 'vue'
import Notify from '../components/Notify.ts'

let notifyContainer: HTMLElement | null = null
const notifyInstances: any[] = []

function ensureNotifyContainer() {
  if (!notifyContainer) {
    notifyContainer = document.createElement('div')
    notifyContainer.classList.add('notify-container')
    document.body.appendChild(notifyContainer)

    // 确保样式只添加一次
    if (!document.querySelector('style#notify-style')) {
      const style = document.createElement('style')
      style.id = 'notify-style'
      style.innerHTML = `
        .notify-container {
          position: fixed;
          display: flex;
          flex-direction: column;
          align-items: center;
          top: 1.4rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
        }

        .notify {
          padding: 10px 20px;
          border-radius: 4px;
          box-sizing: border-box;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          margin-bottom: 10px; /* Add margin to separate notifications */
          transition: opacity 0.3s ease;
        }

        .notify-content {
          font-size: 1rem;
          line-height: 1.5;
        }

        .notify-info {
          background-color: #e6f7ff;
          border: 1px solid #91d5ff;
          color: #1890ff;
        }

        .notify-success {
          background-color: #f6ffed;
          border: 1px solid #b7eb8f;
          color: #52c41a;
        }

        .notify-warning {
          background-color: #fffbe6;
          border: 1px solid #ffe58f;
          color: #faad14;
        }

        .notify-error {
          background-color: #fff1f0;
          border: 1px solid #ffccc7;
          color: #f5222d;
        }

        @media screen and (max-width: 768px) {
          .notify {
            width: calc(100% - 2rem);
          }
        }

        /* Fade transition */
        .fade-enter-active,
        .fade-leave-active {
          transition: opacity 0.5s;
        }

        .fade-enter-from,
        .fade-leave-to {
          opacity: 0;
        }
      `
      document.head.appendChild(style)
    }
  }
}

function removeNotifyContainer() {
  if (notifyContainer) {
    document.body.removeChild(notifyContainer)
    notifyContainer = null
  }
}

export function createNotify(options: {
  message: string
  type?: string
  duration?: number
}) {
  const { message, type = 'info', duration = 3000 } = options

  ensureNotifyContainer()

  const div = document.createElement('div')
  notifyContainer?.appendChild(div)

  const app = createApp({
    render() {
      return h(Notify, {
        message,
        type,
        duration,
        onClose: () => {
          app.unmount()
          notifyContainer?.removeChild(div)
          const index = notifyInstances.indexOf(app)
          if (index !== -1) {
            notifyInstances.splice(index, 1)
            if (notifyInstances.length === 0)
              removeNotifyContainer()
          }
        },
      })
    },
  })

  notifyInstances.push(app)
  app.mount(div)
}
