import express from 'express';
import path from 'path';
import { accountsController } from './controllers/AccountsController';
import { standardsController } from './controllers/StandardsController';
import { complianceRulesController } from './controllers/ComplianceRulesController';
import { adminController } from './controllers/AdminController';
import { adminPlansController } from './controllers/AdminPlansController';
import { adminLogsController, AdminLogsController } from './controllers/AdminLogsController';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

// ==========================================
// 0. RUTA PENTRU DASHBOARD ADMIN (HOME)
// ==========================================
app.get('/Admin', (req, res) => adminController.dashboard(req, res));

// Redirecționare principală către Dashboard-ul Admin
app.get('/', (req, res) => res.redirect('/Admin'));

// ==========================================
// 1. RUTE PENTRU STANDARDS (DIRECTIVE UE)
// ==========================================
app.get('/Standards', (req, res) => standardsController.index(req, res));
app.get('/Standards/Details/:id', (req, res) => standardsController.details(req, res));
app.get('/Standards/Create', (req, res) => standardsController.createGet(req, res));
app.post('/Standards/Create', (req, res) => standardsController.createPost(req, res));
app.get('/Standards/Edit/:id', (req, res) => standardsController.editGet(req, res));
app.post('/Standards/Edit/:id', (req, res) => standardsController.editPost(req, res));
app.post('/Standards/Delete/:id', (req, res) => standardsController.delete(req, res));

// ==========================================
// 2. RUTE PENTRU ACCOUNTS (UTILIZATORI & B2B)
// ==========================================
app.get('/Accounts', (req, res) => accountsController.index(req, res));
app.get('/Accounts/Details/:id', (req, res) => accountsController.details(req, res));
app.get('/Accounts/Create', (req, res) => accountsController.createGet(req, res));
app.post('/Accounts/Create', (req, res) => accountsController.createPost(req, res));
app.get('/Accounts/Edit/:id', (req, res) => accountsController.editGet(req, res));
app.post('/Accounts/Edit/:id', (req, res) => accountsController.editPost(req, res));
app.post('/Accounts/Delete/:id', (req, res) => accountsController.delete(req, res));

// ==========================================
// 3. RUTE PENTRU COMPLIANCE RULES (LAB 6)
// ==========================================
app.get('/ComplianceRules', (req, res) => complianceRulesController.index(req, res));
app.get('/ComplianceRules/Create', (req, res) => complianceRulesController.createGet(req, res));
app.post('/ComplianceRules/Create', (req, res) => complianceRulesController.createPost(req, res));
app.get('/ComplianceRules/Edit/:id', (req, res) => complianceRulesController.editGet(req, res));     // <-- Adaugă această linie
app.post('/ComplianceRules/Edit/:id', (req, res) => complianceRulesController.editPost(req, res));   // <-- Adaugă această linie
app.post('/ComplianceRules/Delete/:id', (req, res) => complianceRulesController.delete(req, res)); // <-- Adaugă această linie

// ==========================================
// 4. RUTE PENTRU CONFIGURARE PACHETE ADMIN
// ==========================================
app.get('/Admin/Plans', (req, res) => adminPlansController.index(req, res));
app.get('/Admin/Plans/Edit/:id', (req, res) => adminPlansController.editGet(req, res));
app.post('/Admin/Plans/Edit/:id', (req, res) => adminPlansController.editPost(req, res));
app.get('/Admin/Logs', (req, res) => adminLogsController.index(req, res));

app.listen(PORT, () => {
  console.log(`Serverul MVC rulează la: http://localhost:${PORT}`);
  console.log(`Dashboard Admin:    http://localhost:${PORT}/Admin`);
  console.log(`Modul Accounts:     http://localhost:${PORT}/Accounts`);
  console.log(`Modul Standards:    http://localhost:${PORT}/Standards`);
  console.log(`Modul Compliance:   http://localhost:${PORT}/ComplianceRules`);
  console.log(`Modul Admin Plans:  http://localhost:${PORT}/Admin/Plans`);
});