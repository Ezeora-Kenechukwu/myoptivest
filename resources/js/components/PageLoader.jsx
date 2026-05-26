import React, { useState } from 'react'
import NProgress from 'nprogress'
import { router } from '@inertiajs/react'
import Preloader from './PreLoader'
const PageLoader = ({settings}) => {
    const [showLoading, setShowLoading] = useState(false)
    let timeout = null
    // NProgress.configure({
    //     template: <Preloader />
    //   });
    router.on('start', () => {
      setShowLoading(true)

    })

    router.on('progress', (event) => {
        setShowLoading(true)

    })

    router.on('finish', (event) => {

      if (event.detail.visit.completed) {
        setShowLoading(false)

      } else if (event.detail.visit.interrupted) {
        setShowLoading(false)

      } else if (event.detail.visit.cancelled) {
        setShowLoading(false)

      }
    })
return (
    //  <Preloader settings={settings} />
    showLoading && <Preloader  />
)
}

export default PageLoader
