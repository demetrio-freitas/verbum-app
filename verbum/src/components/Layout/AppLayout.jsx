import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import BottomNav from './BottomNav.jsx'
import MoreMenu from './MoreMenu.jsx'
import Toast from '../shared/Toast.jsx'
import { useState } from 'react'

export default function AppLayout() {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <BottomNav onMoreClick={() => setMoreMenuOpen(true)} />
      <MoreMenu open={moreMenuOpen} onClose={() => setMoreMenuOpen(false)} />
      <Toast />
    </>
  )
}
