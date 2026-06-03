import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import HomePage from '@/pages/HomePage'
import SearchPage from '@/pages/SearchPage'
import LibraryPage from '@/pages/LibraryPage'
import PoemDetailPage from '@/pages/PoemDetailPage'
import MyBoxPage from '@/pages/MyBoxPage'
import AiCreatePage from '@/pages/AiCreatePage'
import AuthorPage from '@/pages/AuthorPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/poem/:id" element={<PoemDetailPage />} />
          <Route path="/my-box" element={<MyBoxPage />} />
          <Route path="/ai-create" element={<AiCreatePage />} />
          <Route path="/author/:name" element={<AuthorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
