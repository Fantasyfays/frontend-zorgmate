import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home.jsx';
import InvoiceEditForm from './components/InvoiceEditForm';  // Voor het bewerken van facturen
import UsersList from './components/UsersList';
import UserRegistration from './components/UserRegistration';
import InvoicesList from './components/InvoicesList';
import UserEditForm from './components/UserEditForm';
import AutoInvoiceForm from './components/AutoInvoiceForm';
import ClientList from './components/ClientList';
import ClientForm from "./components/ClientForm";
import TimeEntryForm from "./components/TimeEntryForm";
import InvoiceDetails from "./components/InvoiceDetails";

function App() {
    return (
        <Router>
            <NavigationBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<UserRegistration />} />
                <Route path="/users" element={<UsersList />} />
                <Route path="/invoices" element={<InvoicesList />} />
                <Route path="/users/edit/:id" element={<UserEditForm />} />
                <Route path="/invoice/auto" element={<AutoInvoiceForm />} />
                <Route path="/invoice/edit/:id" element={<InvoiceEditForm />} />
                <Route path="/clients" element={<ClientList />} />
                <Route path="/clients/new" element={<ClientForm />} />
                <Route path="/time-entry" element={<TimeEntryForm />} />
                <Route path="/invoice/details/:id" element={<InvoiceDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
