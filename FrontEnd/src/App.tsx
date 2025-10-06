import React, { useState } from 'react'
import { Tabs, Tab, Box, AppBar } from '@mui/material'
import AuthPage from './Components/Authentication/Auth'
import EventForm from './Components/EventCreation/EventForm'
import HomePage from './Components/HomePage/Home'
import Dashboard from './Components/Dashboard/Dashboard'
import TicketPurchasePage from './Components/PurchasePage/PurchasePage'
import './App.css'

function App() {
  const [currentTab, setCurrentTab] = useState(0)

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  return (
    <div className="App">
      <AppBar position="static" color="primary">
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          centered
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab label="Home" />
          <Tab label="Dashboard" />
          <Tab label="Purchase" />
          <Tab label="Authentication" />
          <Tab label="Create Event" />
        </Tabs>
      </AppBar>
      
      <Box sx={{ paddingTop: 0 }}>
        {currentTab === 0 && <HomePage />}
        {currentTab === 1 && <Dashboard />}
        {currentTab === 2 && <TicketPurchasePage />}
        {currentTab === 3 && <AuthPage />}
        {currentTab === 4 && <EventForm />}
      </Box>
    </div>
  )
}

export default App
