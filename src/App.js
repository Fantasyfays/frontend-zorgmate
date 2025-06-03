import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import InvoiceEditForm from './components/InvoiceEditForm';
import UsersList from './components/UsersList';
import UserRegistration from './components/UserRegistration';
import InvoicesList from './components/InvoicesList';
import UserEditForm from './components/UserEditForm';
import AutoInvoiceForm from './components/AutoInvoiceForm';
import ClientList from './components/ClientList';
import ClientForm from "./components/ClientForm";
import TimeEntryForm from "./components/TimeEntryForm";
import InvoiceDetails from "./components/InvoiceDetails";
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';

function App() {
    return (
        <Router>
            <NavigationBar />
            <Routes>
                {/* Alleen inloggen en registreren publiekelijk */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<UserRegistration />} />

                {/* ALLE andere routes vereisen login */}
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
                <Route path="/invoices" element={<ProtectedRoute><InvoicesList /></ProtectedRoute>} />
                <Route path="/users/edit/:id" element={<ProtectedRoute><UserEditForm /></ProtectedRoute>} />
                <Route path="/invoice/auto" element={<ProtectedRoute><AutoInvoiceForm /></ProtectedRoute>} />
                <Route path="/invoice/edit/:id" element={<ProtectedRoute><InvoiceEditForm /></ProtectedRoute>} />
                <Route path="/clients" element={<ProtectedRoute><ClientList /></ProtectedRoute>} />
                <Route path="/clients/new" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
                <Route path="/time-entry" element={<ProtectedRoute><TimeEntryForm /></ProtectedRoute>} />
                <Route path="/invoice/details/:id" element={<ProtectedRoute><InvoiceDetails /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
