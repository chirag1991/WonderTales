import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '@/layout/mainLayout'
import IngredientsPage from '@/pages/ingredients/ingredientsPage'
import StoryPage from '@/pages/story/storyPage'

function App() {
  return (
    <Routes>
      <Route path="" element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/ingredients" replace />} />
        <Route path="/ingredients" element={<IngredientsPage />} />
        <Route path="/story" element={<StoryPage />} />
      </Route>
    </Routes>
  )
}

export default App
