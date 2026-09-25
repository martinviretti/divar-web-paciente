(() => {
  "use strict";

  const STORAGE_KEY = "divar-web-paciente-v2";
  const APP_VERSION = 2;
  const DEMO_CREDENTIALS = {
    established: { email: "paciente.demo@gmail.com", password: "Divar2026!" },
    firstAccess: { email: "nuevo.paciente@gmail.com", password: "DIVAR-4821" }
  };

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const isoDate = (date) => {
    const d = new Date(date);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };
  const dateFromToday = (days) => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + days);
    return isoDate(d);
  };
  const addDays = (dateString, days) => {
    const d = new Date(`${dateString}T12:00:00`);
    d.setDate(d.getDate() + days);
    return isoDate(d);
  };
  const parseLocalDate = (dateString) => new Date(`${dateString}T12:00:00`);
  const formatDate = (dateString, options = {}) => new Intl.DateTimeFormat("es-AR", {
    weekday: options.weekday ?? "long",
    day: options.day ?? "numeric",
    month: options.month ?? "long",
    year: options.year ?? undefined
  }).format(parseLocalDate(dateString));
  const formatShortDate = (dateString) => new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(parseLocalDate(dateString));
  const formatMoney = (value) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(Number(value || 0));
  const capitalize = (text = "") => text.charAt(0).toUpperCase() + text.slice(1);
  const initials = (name = "") => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const uid = (prefix = "id") => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const sortByDateTime = (a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);

  const TREATMENTS = [
    { id: "limpieza", name: "Limpieza dental", summary: "Prevención profesional de placa, sarro y manchas superficiales.", image: "assets/treatments/treatment-limpieza.webp", duration: "45–60 min", category: "Prevención", professionalIds: ["valentina", "sofia"] },
    { id: "ortodoncia", name: "Ortodoncia", summary: "Diagnóstico y corrección progresiva de la alineación dental.", image: "assets/treatments/treatment-ortodoncia.webp", duration: "45 min", category: "Especialidad", professionalIds: ["martin"] },
    { id: "blanqueamiento", name: "Blanqueamiento", summary: "Tratamiento estético para mejorar el tono de la sonrisa.", image: "assets/treatments/treatment-blanqueamiento.webp", duration: "60–90 min", category: "Estética", professionalIds: ["valentina"] },
    { id: "implantes", name: "Implantes dentales", summary: "Alternativas de rehabilitación para recuperar piezas ausentes.", image: "assets/treatments/treatment-implantes.webp", duration: "Según evaluación", category: "Rehabilitación", professionalIds: ["sofia"] },
    { id: "carillas", name: "Carillas", summary: "Diseño estético personalizado para forma, proporción y color.", image: "assets/treatments/treatment-carillas.webp", duration: "Según plan", category: "Estética", professionalIds: ["valentina"] },
    { id: "conducto", name: "Tratamiento de conducto", summary: "Atención endodóntica para preservar piezas comprometidas.", image: "assets/treatments/treatment-conducto.webp", duration: "60–90 min", category: "Endodoncia", professionalIds: ["sofia"] },
    { id: "odontopediatria", name: "Odontopediatría", summary: "Cuidado preventivo y terapéutico adaptado a niños y adolescentes.", image: "assets/treatments/treatment-odontopediatria.webp", duration: "30–45 min", category: "Infantil", professionalIds: ["sofia"] },
    { id: "periodoncia", name: "Periodoncia", summary: "Evaluación y tratamiento de encías y tejidos de soporte.", image: "assets/treatments/treatment-periodoncia.webp", duration: "45–60 min", category: "Encías", professionalIds: ["valentina"] },
    { id: "estetica", name: "Estética dental", summary: "Plan integral que combina salud, proporción y armonía de la sonrisa.", image: "assets/treatments/treatment-estetica.webp", duration: "Según plan", category: "Estética", professionalIds: ["valentina"] },
    { id: "cirugia", name: "Cirugía odontológica", summary: "Procedimientos quirúrgicos con evaluación y seguimiento profesional.", image: "assets/treatments/treatment-cirugia.webp", duration: "Según evaluación", category: "Cirugía", professionalIds: ["sofia"] },
    { id: "radiografias", name: "Radiografías y estudios", summary: "Estudios diagnósticos para acompañar la evaluación clínica.", image: "assets/treatments/treatment-radiografias.webp", duration: "15–30 min", category: "Diagnóstico", professionalIds: ["any"] },
    { id: "urgencias", name: "Urgencias", summary: "Evaluación prioritaria ante dolor intenso, traumatismos o inflamación.", image: "assets/treatments/treatment-urgencias.webp", duration: "Prioridad clínica", category: "Urgencias", professionalIds: ["any"] }
  ];

  const CONSULTATION_TREATMENT = { id: "consulta", name: "Consulta general", summary: "Evaluación inicial o consulta cuando el motivo todavía no está definido.", image: "assets/illustrations/hero-tooth-control.webp", duration: "30–45 min", category: "Evaluación", professionalIds: ["any"] };

  const PROFESSIONALS = [
    { id: "valentina", name: "Dra. Valentina Ruiz", specialty: "Odontología general y estética", license: "Matrícula a configurar", image: "assets/professionals/professional-valentina-ruiz.webp" },
    { id: "martin", name: "Dr. Martín Acosta", specialty: "Ortodoncia", license: "Matrícula a configurar", image: "assets/professionals/professional-martin-acosta.webp" },
    { id: "sofia", name: "Dra. Sofía Benítez", specialty: "Rehabilitación y odontopediatría", license: "Matrícula a configurar", image: "assets/professionals/professional-sofia-benitez.webp" },
    { id: "equipo", name: "Equipo DIVAR", specialty: "Atención coordinada", license: "Datos reales pendientes", image: "assets/professionals/professional-equipo-divar.webp" }
  ];

  const FAQS = [
    { q: "¿El consultorio necesita mi contraseña de Gmail?", a: "No. Solo necesita registrar tu dirección de correo. La contraseña de DIVAR es independiente. Si se incorpora acceso con Google, debe implementarse mediante el flujo oficial de Google OAuth, sin que DIVAR vea tu contraseña." },
    { q: "¿Dónde gestiono mis turnos?", a: "En una única sección llamada Turnos. El inicio muestra un resumen del próximo turno, pero la reserva, reprogramación, cancelación y consulta del historial se realizan siempre desde esa sección." },
    { q: "¿Puedo administrar el turno de un hijo o familiar?", a: "Sí. El portal contempla grupo familiar y permite cambiar de paciente activo. En producción, cada vínculo debe validarse por el consultorio antes de mostrar datos de salud." },
    { q: "¿La web y la app usan información diferente?", a: "No. Esta propuesta funciona como una PWA: la misma aplicación web puede instalarse en celular o computadora y utiliza la misma cuenta y la misma información." },
    { q: "¿Este prototipo ya guarda una historia clínica real?", a: "No. La demostración usa datos locales de ejemplo. Para producción debe conectarse a un backend seguro, con autenticación, permisos, auditoría, cifrado y políticas de protección de datos de salud." }
  ];

  const NAV_ITEMS = [
    { route: "dashboard", label: "Resumen", icon: "assets/icons/icon-inicio.webp", group: "Principal" },
    { route: "appointments", label: "Turnos", icon: "assets/icons/icon-turnos.webp", group: "Principal" },
    { route: "health", label: "Mi salud", icon: "assets/icons/icon-historia-clinica.webp", group: "Principal" },
    { route: "messages", label: "Mensajes", icon: "assets/icons/icon-mensajes.webp", group: "Gestión" },
    { route: "payments", label: "Pagos y presupuestos", icon: "assets/icons/icon-pagos.webp", group: "Gestión" },
    { route: "profile", label: "Perfil y cobertura", icon: "assets/icons/icon-perfil.webp", group: "Cuenta" }
  ];

  const MOBILE_NAV_ROUTES = ["dashboard", "appointments", "health", "messages", "payments", "profile"];
  const MOBILE_NAV_LABELS = { dashboard: "Inicio", appointments: "Turnos", health: "Mi salud", messages: "Mensajes", payments: "Pagos", profile: "Perfil" };

  const defaultState = () => ({
    version: APP_VERSION,
    session: null,
    activePatientId: "patient-1",
    user: {
      id: "user-demo",
      name: "Paciente Demo",
      email: DEMO_CREDENTIALS.established.email,
      phone: "+54 11 0000-0000",
      birthDate: "1991-04-18",
      document: "DNI pendiente",
      address: "Dirección pendiente de configuración",
      passwordChanged: true
    },
    patients: [
      { id: "patient-1", name: "Paciente Demo", relation: "Titular", birthDate: "1991-04-18", initials: "PD", coverage: "Cobertura a configurar", memberNumber: "N.º pendiente", bloodType: "A+", alerts: "Sin alertas informadas" },
      { id: "patient-2", name: "Sofía Demo", relation: "Hija", birthDate: "2013-08-06", initials: "SD", coverage: "Cobertura a configurar", memberNumber: "N.º pendiente", bloodType: "O+", alerts: "Alergia informada: látex (demostración)" }
    ],
    appointments: [
      { id: "appt-1", patientId: "patient-1", date: dateFromToday(8), time: "10:30", treatmentId: "limpieza", professionalId: "valentina", modality: "Presencial", status: "confirmed", location: "Sede DIVAR · dirección a configurar", notes: "Control preventivo y limpieza." },
      { id: "appt-2", patientId: "patient-2", date: dateFromToday(22), time: "16:00", treatmentId: "odontopediatria", professionalId: "sofia", modality: "Presencial", status: "pending", location: "Sede DIVAR · dirección a configurar", notes: "Control semestral." },
      { id: "appt-history-1", patientId: "patient-1", date: dateFromToday(-45), time: "09:00", treatmentId: "radiografias", professionalId: "valentina", modality: "Presencial", status: "done", location: "Sede DIVAR", notes: "Estudio diagnóstico incorporado a la historia clínica." },
      { id: "appt-history-2", patientId: "patient-1", date: dateFromToday(-110), time: "11:30", treatmentId: "limpieza", professionalId: "valentina", modality: "Presencial", status: "done", location: "Sede DIVAR", notes: "Control preventivo." }
    ],
    plans: {
      "patient-1": {
        title: "Plan preventivo y restaurador",
        progress: 68,
        startedAt: dateFromToday(-120),
        estimatedEnd: dateFromToday(95),
        stages: [
          { id: "stage-1", title: "Diagnóstico inicial", detail: "Evaluación clínica y radiografías", status: "complete", cost: 28000 },
          { id: "stage-2", title: "Higiene y prevención", detail: "Limpieza profesional y control", status: "complete", cost: 42000 },
          { id: "stage-3", title: "Restauración", detail: "Tratamiento de dos piezas", status: "active", cost: 165000 },
          { id: "stage-4", title: "Control de evolución", detail: "Revisión final y mantenimiento", status: "pending", cost: 35000 }
        ]
      },
      "patient-2": {
        title: "Plan preventivo infantil",
        progress: 35,
        startedAt: dateFromToday(-60),
        estimatedEnd: dateFromToday(120),
        stages: [
          { id: "p2-stage-1", title: "Evaluación", detail: "Control clínico", status: "complete", cost: 25000 },
          { id: "p2-stage-2", title: "Prevención", detail: "Limpieza y topicación", status: "active", cost: 38000 },
          { id: "p2-stage-3", title: "Seguimiento", detail: "Control semestral", status: "pending", cost: 25000 }
        ]
      }
    },
    clinicalHistory: [
      { id: "history-1", patientId: "patient-1", date: dateFromToday(-45), title: "Estudio diagnóstico", professionalId: "valentina", description: "Se incorporó radiografía panorámica. Se definió un plan preventivo y restaurador.", tags: ["Radiografía", "Diagnóstico"] },
      { id: "history-2", patientId: "patient-1", date: dateFromToday(-110), title: "Control y limpieza", professionalId: "valentina", description: "Higiene profesional, control de encías y recomendaciones de cuidado domiciliario.", tags: ["Limpieza", "Prevención"] },
      { id: "history-3", patientId: "patient-1", date: dateFromToday(-240), title: "Consulta inicial", professionalId: "equipo", description: "Apertura de historia clínica y evaluación general.", tags: ["Ingreso"] },
      { id: "history-4", patientId: "patient-2", date: dateFromToday(-60), title: "Control odontopediátrico", professionalId: "sofia", description: "Evaluación preventiva. Se recomienda reforzar higiene y programar control.", tags: ["Odontopediatría", "Prevención"] }
    ],
    documents: [
      { id: "doc-1", patientId: "patient-1", name: "Radiografía panorámica", type: "Imagen diagnóstica", fileName: "panoramica-demo.pdf", date: dateFromToday(-45), size: "1,8 MB", status: "available" },
      { id: "doc-2", patientId: "patient-1", name: "Presupuesto del plan", type: "Presupuesto", fileName: "presupuesto-demo.pdf", date: dateFromToday(-43), size: "320 KB", status: "available" },
      { id: "doc-3", patientId: "patient-1", name: "Consentimiento informado", type: "Consentimiento", fileName: "consentimiento-demo.pdf", date: dateFromToday(-42), size: "210 KB", status: "pending-signature" },
      { id: "doc-4", patientId: "patient-2", name: "Ficha de ingreso pediátrica", type: "Formulario", fileName: "ficha-pediatrica.pdf", date: dateFromToday(-61), size: "180 KB", status: "available" }
    ],
    messages: [
      { id: "msg-1", patientId: "patient-1", sender: "clinic", author: "Recepción DIVAR", text: "Hola. Tu próximo turno quedó confirmado. Recordá traer los estudios solicitados.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), read: true },
      { id: "msg-2", patientId: "patient-1", sender: "user", author: "Paciente Demo", text: "Perfecto, muchas gracias. Los voy a cargar en el portal.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true },
      { id: "msg-3", patientId: "patient-1", sender: "clinic", author: "Recepción DIVAR", text: "Excelente. Al cargarlos quedan asociados a tu historia para que el profesional pueda revisarlos.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), read: false },
      { id: "msg-4", patientId: "patient-2", sender: "clinic", author: "Recepción DIVAR", text: "El control de Sofía se encuentra pendiente de confirmación.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), read: false }
    ],
    payments: [
      { id: "pay-1", patientId: "patient-1", concept: "Seña etapa restauradora", amount: 55000, dueDate: dateFromToday(14), status: "pending", type: "payment" },
      { id: "pay-2", patientId: "patient-1", concept: "Limpieza y control", amount: 42000, paidAt: dateFromToday(-110), status: "paid", type: "invoice", receipt: "REC-00028" },
      { id: "pay-3", patientId: "patient-1", concept: "Estudio diagnóstico", amount: 28000, paidAt: dateFromToday(-45), status: "paid", type: "invoice", receipt: "REC-00041" },
      { id: "pay-4", patientId: "patient-2", concept: "Control odontopediátrico", amount: 25000, paidAt: dateFromToday(-60), status: "paid", type: "invoice", receipt: "REC-00037" }
    ],
    notifications: [
      { id: "notification-1", patientId: "patient-1", title: "Turno confirmado", text: "Tu limpieza dental quedó reservada.", route: "appointments", icon: "✓", createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), read: false },
      { id: "notification-2", patientId: "patient-1", title: "Documento pendiente", text: "Tenés un consentimiento informado para revisar.", route: "health", healthTab: "documents", icon: "▤", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), read: false },
      { id: "notification-3", patientId: "patient-1", title: "Nuevo mensaje", text: "Recepción DIVAR respondió tu consulta.", route: "messages", icon: "●", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), read: true }
    ],
    settings: { emailNotifications: true, appointmentReminders: true, documentAlerts: true, marketing: false },
    ui: { appointmentFilter: "upcoming", healthTab: "plan", profileTab: "personal", treatmentExpanded: false }
  });

  let state = loadState();
  let bookingDraft = null;
  let deferredInstallPrompt = null;
  let publicTreatmentsExpanded = false;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== APP_VERSION) return defaultState();
      return parsed;
    } catch (error) {
      console.warn("No se pudo leer el estado local:", error);
      return defaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("No se pudo guardar el estado local:", error);
    }
  }

  function resetDemoState() {
    state = defaultState();
    saveState();
    renderPublicContent();
  }

  function getActivePatient() {
    return state.patients.find((patient) => patient.id === state.activePatientId) || state.patients[0];
  }

  function getTreatment(id) {
    if (id === "consulta") return CONSULTATION_TREATMENT;
    return TREATMENTS.find((item) => item.id === id) || TREATMENTS[0];
  }

  function getProfessional(id) {
    if (id === "any") return { id: "any", name: "Primer profesional disponible", specialty: "Asignación según agenda", image: "assets/professionals/professional-equipo-divar.webp" };
    return PROFESSIONALS.find((item) => item.id === id) || PROFESSIONALS[3];
  }

  function getPatientAppointments(patientId = state.activePatientId) {
    return state.appointments.filter((appointment) => appointment.patientId === patientId);
  }

  function getUpcomingAppointments(patientId = state.activePatientId) {
    const today = isoDate(new Date());
    return getPatientAppointments(patientId)
      .filter((appointment) => !["cancelled", "done"].includes(appointment.status) && appointment.date >= today)
      .sort(sortByDateTime);
  }

  function getPastAppointments(patientId = state.activePatientId) {
    const today = isoDate(new Date());
    return getPatientAppointments(patientId)
      .filter((appointment) => ["cancelled", "done"].includes(appointment.status) || appointment.date < today)
      .sort((a, b) => sortByDateTime(b, a));
  }

  function getPendingBalance(patientId = state.activePatientId) {
    return state.payments.filter((payment) => payment.patientId === patientId && payment.status === "pending").reduce((sum, item) => sum + Number(item.amount), 0);
  }

  function getUnreadCount(patientId = state.activePatientId) {
    return state.notifications.filter((notification) => notification.patientId === patientId && !notification.read).length;
  }

  function renderPublicContent() {
    renderPublicTreatments();
    const professionalGrid = qs("#professionalGrid");
    if (professionalGrid) professionalGrid.innerHTML = PROFESSIONALS.map((professional) => `
      <article class="professional-card">
        <div class="professional-card__photo"><img src="${professional.image}" alt="${escapeHtml(professional.name)}"></div>
        <div class="professional-card__body">
          <h3>${escapeHtml(professional.name)}</h3>
          <p>${escapeHtml(professional.specialty)}</p>
          <span class="professional-card__tag">${escapeHtml(professional.license)}</span>
        </div>
      </article>
    `).join("");

    const faqList = qs("#faqList");
    if (faqList) faqList.innerHTML = FAQS.map((faq, index) => `
      <article class="faq-item" data-faq-index="${index}">
        <button type="button" data-action="toggle-faq" data-index="${index}" aria-expanded="false">
          <span>${escapeHtml(faq.q)}</span><span aria-hidden="true">+</span>
        </button>
        <div class="faq-item__answer" hidden>${escapeHtml(faq.a)}</div>
      </article>
    `).join("");
  }

  function renderPublicTreatments() {
    const grid = qs("#publicTreatmentGrid");
    if (!grid) return;
    const items = publicTreatmentsExpanded ? TREATMENTS : TREATMENTS.slice(0, 4);
    grid.innerHTML = items.map((treatment) => `
      <article class="treatment-card" tabindex="0" role="button" data-action="open-treatment" data-treatment-id="${treatment.id}" aria-label="Ver información de ${escapeHtml(treatment.name)}">
        <div class="treatment-card__image"><img src="${treatment.image}" alt="Ilustración de ${escapeHtml(treatment.name)}"></div>
        <div class="treatment-card__body">
          <h3>${escapeHtml(treatment.name)}</h3>
          <p>${escapeHtml(treatment.summary)}</p>
          <div class="treatment-card__meta"><span>${escapeHtml(treatment.category)} · ${escapeHtml(treatment.duration)}</span><span aria-hidden="true">→</span></div>
        </div>
      </article>
    `).join("");
    const button = qs('[data-action="show-all-treatments"]');
    if (button) button.textContent = publicTreatmentsExpanded ? "Ver menos tratamientos" : "Ver todos los tratamientos";
  }

  function showPublicSite() {
    qs("#publicSite").hidden = false;
    qs("#portalApp").hidden = true;
    closeNotifications();
    document.body.classList.remove("portal-mode");
    requestAnimationFrame(() => {
      const targetId = location.hash && !location.hash.startsWith("#portal/") ? location.hash.slice(1) : "inicio";
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function showPortal(route = "dashboard") {
    if (!state.session) {
      showPublicSite();
      openLoginModal();
      return;
    }
    qs("#publicSite").hidden = true;
    qs("#portalApp").hidden = false;
    document.body.classList.add("portal-mode");
    renderPortalChrome(route);
    renderPortalPage(route);
  }

  function currentRoute() {
    const hash = location.hash;
    if (!hash.startsWith("#portal/")) return null;
    const route = hash.replace("#portal/", "").split("?")[0];
    return NAV_ITEMS.some((item) => item.route === route) ? route : "dashboard";
  }

  function navigate(route) {
    if (!state.session) {
      openLoginModal();
      return;
    }
    const nextHash = `#portal/${route}`;
    if (location.hash === nextHash) {
      showPortal(route);
      closeSidebar();
      closeNotifications();
      return;
    }
    location.hash = nextHash;
  }

  function renderPortalChrome(route) {
    const patient = getActivePatient();
    const sidebarCard = qs("#sidebarPatientCard");
    sidebarCard.innerHTML = `
      <div class="patient-avatar">${escapeHtml(patient.initials || initials(patient.name))}</div>
      <div class="patient-compact__text"><strong>${escapeHtml(patient.name)}</strong><span>${escapeHtml(patient.relation)} · ${escapeHtml(patient.coverage)}</span></div>
      <button type="button" data-action="switch-patient" aria-label="Cambiar paciente">⌄</button>
    `;

    const nav = qs("#portalNavigation");
    let lastGroup = "";
    nav.innerHTML = NAV_ITEMS.map((item) => {
      const group = item.group !== lastGroup ? `<div class="portal-nav__group-label">${escapeHtml(item.group)}</div>` : "";
      lastGroup = item.group;
      return `${group}<button type="button" class="${item.route === route ? "is-active" : ""}" data-action="navigate" data-route="${item.route}"><img src="${item.icon}" alt=""><span>${escapeHtml(item.label)}</span></button>`;
    }).join("");

    const mobileNav = qs("#mobilePortalNav");
    mobileNav.innerHTML = NAV_ITEMS.filter((item) => MOBILE_NAV_ROUTES.includes(item.route)).map((item) => `
      <button type="button" class="${item.route === route ? "is-active" : ""}" data-action="navigate" data-route="${item.route}"><img src="${item.icon}" alt=""><span>${escapeHtml(MOBILE_NAV_LABELS[item.route] || item.label)}</span></button>
    `).join("");

    const item = NAV_ITEMS.find((navItem) => navItem.route === route) || NAV_ITEMS[0];
    qs("#portalBreadcrumb").innerHTML = `<span class="portal-breadcrumb__eyebrow">Portal del paciente</span><span class="portal-breadcrumb__title">${escapeHtml(item.label)}</span>`;
    qs("#topbarProfile").innerHTML = `<span class="patient-avatar">${escapeHtml(patient.initials || initials(patient.name))}</span><span><strong>${escapeHtml(patient.name)}</strong><span>${escapeHtml(patient.relation)}</span></span>`;
    const unread = getUnreadCount();
    qs("#notificationCount").textContent = String(unread);
    qs("#notificationCount").hidden = unread === 0;
    renderNotifications();
  }

  function renderPortalPage(route) {
    const main = qs("#portalMain");
    const renderers = {
      dashboard: renderDashboard,
      appointments: renderAppointments,
      health: renderHealth,
      messages: renderMessages,
      payments: renderPayments,
      profile: renderProfile
    };
    main.innerHTML = (renderers[route] || renderDashboard)();
    main.focus({ preventScroll: true });
    closeSidebar();
  }

  function pageHeading(title, description, actions = "", eyebrow = "Portal del paciente") {
    return `
      <div class="page-heading">
        <div class="page-heading__copy"><span class="eyebrow">${escapeHtml(eyebrow)}</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div>
        ${actions ? `<div class="page-heading__actions">${actions}</div>` : ""}
      </div>
    `;
  }

  function renderDashboard() {
    const patient = getActivePatient();
    const firstName = patient.name.split(" ")[0];
    const nextAppointment = getUpcomingAppointments()[0];
    const plan = state.plans[patient.id];
    const patientDocuments = state.documents.filter((document) => document.patientId === patient.id);
    const pendingDocs = patientDocuments.filter((document) => document.status === "pending-signature").length;
    const pendingBalance = getPendingBalance();
    const unreadMessages = state.messages.filter((message) => message.patientId === patient.id && message.sender === "clinic" && !message.read).length;
    const latestMessage = state.messages.filter((message) => message.patientId === patient.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    return `<section class="portal-page">
      <div class="dashboard-hero">
        <div class="dashboard-hero__copy">
          <span class="eyebrow">Resumen personal</span>
          <h1>Hola, ${escapeHtml(firstName)}.</h1>
          <p>Este inicio resume lo importante. La gestión completa de reservas, cambios y cancelaciones vive únicamente en la sección Turnos.</p>
          ${nextAppointment ? `
            <div class="next-appointment-inline">
              <div class="next-appointment-inline__date"><div><strong>${parseLocalDate(nextAppointment.date).getDate()}</strong><span>${new Intl.DateTimeFormat("es-AR", { month: "short" }).format(parseLocalDate(nextAppointment.date))}</span></div></div>
              <div class="next-appointment-inline__info"><strong>Próximo turno: ${escapeHtml(getTreatment(nextAppointment.treatmentId).name)}</strong><span>${capitalize(formatDate(nextAppointment.date, { year: undefined }))} · ${escapeHtml(nextAppointment.time)} h · ${escapeHtml(getProfessional(nextAppointment.professionalId).name)}</span></div>
              <button class="button button--compact" data-action="navigate" data-route="appointments">Ver o gestionar</button>
            </div>
          ` : `
            <div class="next-appointment-inline"><div class="next-appointment-inline__info"><strong>No tenés turnos próximos</strong><span>Podés reservar uno desde la sección Turnos.</span></div><button class="button button--compact" data-action="open-booking">Reservar turno</button></div>
          `}
        </div>
        <div class="dashboard-hero__visual"><img src="assets/illustrations/hero-tooth-prevention.webp" alt="Ilustración de cuidado dental"></div>
      </div>

      <div class="metric-grid">
        ${metricCard("Plan de tratamiento", `${plan?.progress ?? 0}%`, plan ? `${plan.stages.filter((stage) => stage.status === "complete").length} de ${plan.stages.length} etapas completadas` : "Sin plan activo", "assets/icons/icon-tratamientos.webp", plan?.progress ?? 0, "navigate-health", "plan")}
        ${metricCard("Documentos", patientDocuments.length, pendingDocs ? `${pendingDocs} pendiente${pendingDocs > 1 ? "s" : ""} de revisión` : "Todo al día", "assets/icons/icon-estudios.webp", null, "navigate-health", "documents")}
        ${metricCard("Saldo pendiente", pendingBalance ? formatMoney(pendingBalance) : "$0", pendingBalance ? "Vencimientos disponibles en Pagos" : "Sin deuda registrada", "assets/icons/icon-pagos.webp", null, "navigate", "payments")}
        ${metricCard("Mensajes nuevos", unreadMessages, unreadMessages ? "Recepción respondió tu consulta" : "Sin mensajes pendientes", "assets/icons/icon-mensajes.webp", null, "navigate", "messages")}
      </div>

      <div class="dashboard-grid">
        <article class="portal-card">
          <div class="portal-card__header"><div><h2>Acciones rápidas</h2><p>Solo las tareas que suelen necesitarse desde el inicio</p></div></div>
          <div class="portal-card__body quick-actions">
            <button class="quick-action" data-action="open-booking"><img src="assets/icons/icon-turnos.webp" alt=""><strong>Reservar turno</strong><span>Elegir motivo, profesional, fecha y horario</span></button>
            <button class="quick-action" data-action="upload-document"><img src="assets/icons/icon-estudios.webp" alt=""><strong>Cargar un estudio</strong><span>Adjuntar imagen o PDF a tu perfil</span></button>
            <button class="quick-action" data-action="navigate" data-route="messages"><img src="assets/icons/icon-mensajes.webp" alt=""><strong>Escribir al consultorio</strong><span>Consultas administrativas no urgentes</span></button>
          </div>
        </article>

        <article class="portal-card">
          <div class="portal-card__header"><div><h2>Mi tratamiento</h2><p>${escapeHtml(plan?.title || "Sin plan activo")}</p></div><button class="text-link" data-action="navigate-health" data-tab="plan">Ver detalle</button></div>
          <div class="portal-card__body treatment-progress">
            ${plan ? `
              <div class="treatment-progress__summary"><div class="progress-ring" style="--value:${plan.progress}"><strong>${plan.progress}%</strong></div><div><h3>${escapeHtml(plan.title)}</h3><p>Inicio: ${formatShortDate(plan.startedAt)} · Fin estimado: ${formatShortDate(plan.estimatedEnd)}</p></div></div>
              <div class="mini-step-list">${plan.stages.slice(0, 3).map((stage, index) => `<div class="mini-step ${stage.status === "complete" ? "is-complete" : stage.status === "active" ? "is-active" : ""}"><span class="mini-step__status">${stage.status === "complete" ? "✓" : index + 1}</span><strong>${escapeHtml(stage.title)}</strong><span>${stage.status === "complete" ? "Completada" : stage.status === "active" ? "En curso" : "Pendiente"}</span></div>`).join("")}</div>
            ` : `<div class="empty-state"><h3>Sin plan activo</h3><p>Cuando el profesional defina un plan, aparecerá en esta sección.</p></div>`}
          </div>
        </article>

        <article class="portal-card">
          <div class="portal-card__header"><div><h2>Último mensaje</h2><p>Canal administrativo con el consultorio</p></div><button class="text-link" data-action="navigate" data-route="messages">Abrir conversación</button></div>
          <div class="portal-card__body">
            ${latestMessage ? `<div class="message-preview"><div class="message-preview__top"><img class="message-preview__avatar" src="${latestMessage.sender === "clinic" ? "assets/professionals/professional-equipo-divar.webp" : "assets/brand/logo-symbol.webp"}" alt=""><div><strong>${escapeHtml(latestMessage.author)}</strong><span>${formatRelativeTime(latestMessage.createdAt)}</span></div></div><p>${escapeHtml(latestMessage.text)}</p></div>` : `<div class="empty-state"><p>No hay mensajes todavía.</p></div>`}
          </div>
        </article>

        <article class="portal-card">
          <div class="portal-card__header"><div><h2>Información útil</h2><p>Datos visibles para el paciente activo</p></div></div>
          <div class="portal-card__body info-list">
            <div class="info-row"><span>Cobertura</span><strong>${escapeHtml(patient.coverage)}</strong></div>
            <div class="info-row"><span>Número de afiliado</span><strong>${escapeHtml(patient.memberNumber)}</strong></div>
            <div class="info-row"><span>Alertas médicas</span><strong>${escapeHtml(patient.alerts)}</strong></div>
            <div class="info-row"><span>Grupo familiar</span><strong>${state.patients.length} paciente${state.patients.length > 1 ? "s" : ""}</strong></div>
          </div>
        </article>
      </div>
    </section>`;
  }

  function metricCard(label, value, foot, icon, progress = null, action = "", target = "") {
    const data = action === "navigate" ? `data-action="navigate" data-route="${target}"` : action === "navigate-health" ? `data-action="navigate-health" data-tab="${target}"` : "";
    return `<button type="button" class="metric-card" ${data} style="text-align:left"><div class="metric-card__top"><span class="metric-card__label">${escapeHtml(label)}</span><span class="metric-card__icon"><img src="${icon}" alt=""></span></div><strong class="metric-card__value">${escapeHtml(value)}</strong><span class="metric-card__foot">${escapeHtml(foot)}</span>${progress !== null ? `<div class="metric-card__progress"><span style="width:${Math.min(100, Math.max(0, progress))}%"></span></div>` : ""}</button>`;
  }

  function renderAppointments() {
    const filter = state.ui.appointmentFilter || "upcoming";
    const upcoming = getUpcomingAppointments();
    const history = getPastAppointments();
    const activeList = filter === "upcoming" ? upcoming : history;
    const next = upcoming[0];
    const actions = `<button class="button button--primary" data-action="open-booking">Reservar nuevo turno</button>`;

    return `<section class="portal-page">
      ${pageHeading("Turnos", "Una única sección para reservar, confirmar, reprogramar, cancelar y consultar turnos anteriores.", actions)}
      ${next && filter === "upcoming" ? renderAppointmentBanner(next) : ""}
      <article class="portal-card">
        <div class="portal-card__header">
          <div><h2>${filter === "upcoming" ? "Próximos turnos" : "Historial de turnos"}</h2><p>${filter === "upcoming" ? "Ordenados por fecha" : "Atenciones completadas y canceladas"}</p></div>
          <div class="segmented-control" role="tablist"><button class="${filter === "upcoming" ? "is-active" : ""}" data-action="set-appointment-filter" data-filter="upcoming">Próximos (${upcoming.length})</button><button class="${filter === "history" ? "is-active" : ""}" data-action="set-appointment-filter" data-filter="history">Historial (${history.length})</button></div>
        </div>
        <div class="portal-card__body">
          ${activeList.length ? `<div class="appointment-list">${activeList.map(renderAppointmentCard).join("")}</div>` : `<div class="empty-state"><img src="assets/illustrations/hero-tooth-control.webp" alt=""><h3>${filter === "upcoming" ? "No hay turnos próximos" : "Todavía no hay historial"}</h3><p>${filter === "upcoming" ? "Cuando reserves o el consultorio te asigne un turno, aparecerá aquí." : "Las atenciones completadas se registrarán en esta vista."}</p>${filter === "upcoming" ? `<button class="button button--primary" data-action="open-booking">Reservar turno</button>` : ""}</div>`}
        </div>
      </article>
    </section>`;
  }

  function renderAppointmentBanner(appointment) {
    const treatment = getTreatment(appointment.treatmentId);
    const professional = getProfessional(appointment.professionalId);
    const date = parseLocalDate(appointment.date);
    return `<div class="appointment-summary-banner"><div class="appointment-summary-banner__date"><div><strong>${date.getDate()}</strong><span>${new Intl.DateTimeFormat("es-AR", { month: "short" }).format(date)}</span></div></div><div><h2>${escapeHtml(treatment.name)}</h2><p>${capitalize(formatDate(appointment.date, { year: undefined }))} · ${escapeHtml(appointment.time)} h · ${escapeHtml(professional.name)}</p></div><div class="appointment-summary-banner__actions"><button class="button button--soft button--compact" data-action="appointment-details" data-id="${appointment.id}">Ver detalle</button><button class="button button--ghost button--compact" data-action="reschedule-appointment" data-id="${appointment.id}">Reprogramar</button></div></div>`;
  }

  function renderAppointmentCard(appointment) {
    const treatment = getTreatment(appointment.treatmentId);
    const professional = getProfessional(appointment.professionalId);
    const date = parseLocalDate(appointment.date);
    const statusLabels = { confirmed: "Confirmado", pending: "Pendiente", cancelled: "Cancelado", done: "Completado" };
    const statusClass = appointment.status === "confirmed" ? "confirmed" : appointment.status === "pending" ? "pending" : appointment.status === "cancelled" ? "cancelled" : "done";
    const manageable = !["cancelled", "done"].includes(appointment.status) && appointment.date >= isoDate(new Date());
    return `<article class="appointment-card"><div class="appointment-card__date"><div><strong>${date.getDate()}</strong><span>${new Intl.DateTimeFormat("es-AR", { month: "short" }).format(date)}</span></div></div><div class="appointment-card__info"><h3>${escapeHtml(treatment.name)}</h3><p>${capitalize(formatDate(appointment.date, { year: undefined }))} · ${escapeHtml(appointment.time)} h<br>${escapeHtml(professional.name)}</p><div class="appointment-card__meta"><span class="status-pill status-pill--${statusClass}">${statusLabels[appointment.status]}</span><span class="meta-pill">${escapeHtml(appointment.modality)}</span><span class="meta-pill">${escapeHtml(getActivePatient().name)}</span></div></div><div class="appointment-card__actions"><button class="icon-button" data-action="appointment-details" data-id="${appointment.id}" title="Ver detalle" aria-label="Ver detalle">i</button>${manageable ? `<button class="icon-button" data-action="reschedule-appointment" data-id="${appointment.id}" title="Reprogramar" aria-label="Reprogramar">↻</button><button class="icon-button" data-action="cancel-appointment" data-id="${appointment.id}" title="Cancelar" aria-label="Cancelar">×</button>` : ""}</div></article>`;
  }

  function renderHealth() {
    const tab = state.ui.healthTab || "plan";
    const tabs = [
      { id: "plan", label: "Plan de tratamiento", icon: "assets/icons/icon-tratamientos.webp" },
      { id: "history", label: "Historial clínico", icon: "assets/icons/icon-historia-clinica.webp" },
      { id: "documents", label: "Estudios y documentos", icon: "assets/icons/icon-estudios.webp" }
    ];
    const action = tab === "documents" ? `<button class="button button--primary" data-action="upload-document">Cargar archivo</button>` : "";
    return `<section class="portal-page">${pageHeading("Mi salud", "Plan, historial y documentos agrupados en una sola área para evitar información dispersa.", action)}<div class="health-tabs">${tabs.map((item) => `<button class="${tab === item.id ? "is-active" : ""}" data-action="set-health-tab" data-tab="${item.id}"><img src="${item.icon}" alt=""><span>${item.label}</span></button>`).join("")}</div>${tab === "plan" ? renderTreatmentPlan() : tab === "history" ? renderClinicalHistory() : renderDocuments()}</section>`;
  }

  function renderTreatmentPlan() {
    const patient = getActivePatient();
    const plan = state.plans[patient.id];
    if (!plan) return `<div class="empty-state"><img src="assets/illustrations/hero-tooth-clean.webp" alt=""><h3>No hay un plan activo</h3><p>Cuando el profesional defina un tratamiento, se mostrará aquí con etapas, progreso y presupuesto.</p></div>`;
    const completed = plan.stages.filter((stage) => stage.status === "complete").length;
    const total = plan.stages.reduce((sum, stage) => sum + Number(stage.cost || 0), 0);
    return `<div class="health-layout"><div><div class="plan-hero"><span class="eyebrow eyebrow--light">Plan activo</span><h2>${escapeHtml(plan.title)}</h2><p>Seguimiento de etapas acordadas con el profesional. Los importes y fechas son demostrativos.</p><div class="plan-hero__progress"><div class="plan-hero__progress-top"><span>${completed} de ${plan.stages.length} etapas</span><strong>${plan.progress}%</strong></div><div class="plan-hero__progress-bar"><span style="width:${plan.progress}%"></span></div></div></div><article class="portal-card" style="margin-top:18px"><div class="portal-card__header"><div><h2>Etapas del plan</h2><p>Orden clínico propuesto</p></div></div><div class="portal-card__body plan-stage-list">${plan.stages.map((stage, index) => `<div class="plan-stage ${stage.status === "complete" ? "is-complete" : stage.status === "active" ? "is-active" : ""}"><span class="plan-stage__number">${stage.status === "complete" ? "✓" : index + 1}</span><div><h3>${escapeHtml(stage.title)}</h3><p>${escapeHtml(stage.detail)}</p></div><strong class="plan-stage__cost">${formatMoney(stage.cost)}</strong></div>`).join("")}</div></article></div><div><article class="portal-card"><div class="portal-card__header"><div><h2>Resumen del plan</h2><p>Información de referencia</p></div></div><div class="portal-card__body info-list"><div class="info-row"><span>Paciente</span><strong>${escapeHtml(patient.name)}</strong></div><div class="info-row"><span>Inicio</span><strong>${formatShortDate(plan.startedAt)}</strong></div><div class="info-row"><span>Fin estimado</span><strong>${formatShortDate(plan.estimatedEnd)}</strong></div><div class="info-row"><span>Presupuesto total</span><strong>${formatMoney(total)}</strong></div><div class="info-row"><span>Estado</span><strong>En curso</strong></div></div></article><article class="portal-card" style="margin-top:18px"><div class="portal-card__header"><div><h2>Próximo paso</h2><p>Etapa actualmente activa</p></div></div><div class="portal-card__body">${(() => { const active = plan.stages.find((stage) => stage.status === "active") || plan.stages.find((stage) => stage.status === "pending"); return active ? `<div class="message-preview"><strong>${escapeHtml(active.title)}</strong><p>${escapeHtml(active.detail)}. Podés consultar al consultorio antes de reservar.</p><button class="button button--soft button--compact" style="margin-top:12px" data-action="navigate" data-route="messages">Enviar consulta</button></div>` : `<p>Plan completado.</p>`; })()}</div></article></div></div>`;
  }

  function renderClinicalHistory() {
    const items = state.clinicalHistory.filter((entry) => entry.patientId === state.activePatientId).sort((a, b) => b.date.localeCompare(a.date));
    return `<article class="portal-card"><div class="portal-card__header"><div><h2>Historial clínico</h2><p>Resumen visible para el paciente. La historia clínica completa depende del backend del consultorio.</p></div><button class="button button--soft button--compact" data-action="print-page">Imprimir resumen</button></div><div class="portal-card__body">${items.length ? `<div class="timeline">${items.map((entry) => { const professional = getProfessional(entry.professionalId); return `<div class="timeline-item"><span class="timeline-item__dot">${parseLocalDate(entry.date).getDate()}</span><div class="timeline-item__card"><time>${capitalize(formatDate(entry.date, { year: "numeric" }))}</time><h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.description)}<br><strong>${escapeHtml(professional.name)}</strong></p><div class="timeline-item__details">${entry.tags.map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join("")}</div></div></div>`; }).join("")}</div>` : `<div class="empty-state"><p>No hay registros clínicos visibles.</p></div>`}</div></article>`;
  }

  function renderDocuments() {
    const documents = state.documents.filter((document) => document.patientId === state.activePatientId).sort((a, b) => b.date.localeCompare(a.date));
    return `<article class="portal-card"><div class="portal-card__body"><div class="document-toolbar"><div><h2 style="margin:0;font-size:18px">Estudios y documentos</h2><p style="margin:5px 0 0;color:var(--ink-500);font-size:10px">Imágenes, presupuestos, consentimientos y archivos compartidos.</p></div><button class="button button--primary button--compact" data-action="upload-document">Cargar archivo</button></div>${documents.length ? `<div class="document-list">${documents.map((document) => `<div class="document-row"><span class="document-row__icon">${document.type === "Imagen diagnóstica" ? "◉" : document.type === "Consentimiento" ? "✎" : "▤"}</span><div><h3>${escapeHtml(document.name)}</h3><p>${escapeHtml(document.type)} · ${formatShortDate(document.date)} · ${escapeHtml(document.size)}</p>${document.status === "pending-signature" ? `<span class="status-pill status-pill--pending" style="margin-top:6px">Pendiente de revisión</span>` : ""}</div><div class="document-row__actions"><button class="button button--soft button--compact" data-action="view-document" data-id="${document.id}">Ver</button>${document.status === "pending-signature" ? `<button class="button button--primary button--compact" data-action="sign-document" data-id="${document.id}">Revisar</button>` : ""}</div></div>`).join("")}</div>` : `<div class="empty-state"><img src="assets/illustrations/hero-tooth-control.webp" alt=""><h3>No hay documentos</h3><p>Cargá un archivo para asociarlo al paciente activo.</p><button class="button button--primary" data-action="upload-document">Cargar archivo</button></div>`}</div></article>`;
  }

  function renderMessages() {
    const patient = getActivePatient();
    const messages = state.messages.filter((message) => message.patientId === patient.id).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    messages.filter((message) => message.sender === "clinic").forEach((message) => { message.read = true; });
    state.notifications.filter((notification) => notification.patientId === patient.id && notification.route === "messages").forEach((notification) => { notification.read = true; });
    saveState();
    setTimeout(() => updateNotificationBadge(), 0);
    return `<section class="portal-page">${pageHeading("Mensajes", "Canal administrativo para consultas no urgentes. Ante una urgencia, usá los canales prioritarios del consultorio.")}<div class="messages-layout"><aside class="message-sidebar"><div class="message-sidebar__header"><h2>Conversaciones</h2><p>Paciente activo: ${escapeHtml(patient.name)}</p></div><button class="conversation-item is-active"><img src="assets/professionals/professional-equipo-divar.webp" alt="Equipo DIVAR"><div><strong>Recepción DIVAR</strong><span>${messages.at(-1) ? escapeHtml(messages.at(-1).text) : "Sin mensajes"}</span></div><time>${messages.at(-1) ? formatRelativeTime(messages.at(-1).createdAt, true) : ""}</time></button></aside><section class="chat-panel"><header class="chat-header"><div class="chat-header__person"><img src="assets/professionals/professional-equipo-divar.webp" alt=""><div><strong>Recepción DIVAR</strong><span>Canal administrativo</span></div></div><button class="button button--soft button--compact" data-action="open-emergency">Urgencias</button></header><div class="chat-messages" id="chatMessages"><div class="chat-day">Conversación del paciente</div>${messages.length ? messages.map((message) => `<div class="message-bubble ${message.sender === "user" ? "is-own" : ""}">${escapeHtml(message.text)}<time>${new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" }).format(new Date(message.createdAt))}</time></div>`).join("") : `<div class="empty-state"><p>Escribí tu primera consulta.</p></div>`}</div><form class="chat-composer" id="messageForm"><div class="quick-message-topics"><button type="button" data-action="message-topic" data-text="Necesito consultar por mi próximo turno.">Consultar turno</button><button type="button" data-action="message-topic" data-text="Quisiera consultar por mi presupuesto.">Consultar presupuesto</button><button type="button" data-action="message-topic" data-text="Adjunté un estudio y quisiera confirmar que se recibió correctamente.">Confirmar estudio</button></div><div class="chat-composer__row"><textarea id="messageInput" name="message" maxlength="600" placeholder="Escribí un mensaje..." aria-label="Mensaje"></textarea><button class="button button--primary" type="submit" aria-label="Enviar mensaje">→</button></div></form></section></div></section>`;
  }

  function renderPayments() {
    const patient = getActivePatient();
    const items = state.payments.filter((payment) => payment.patientId === patient.id);
    const pending = items.filter((payment) => payment.status === "pending");
    const paid = items.filter((payment) => payment.status === "paid").sort((a, b) => (b.paidAt || "").localeCompare(a.paidAt || ""));
    const balance = pending.reduce((sum, item) => sum + item.amount, 0);
    const plan = state.plans[patient.id];
    const budgetTotal = plan ? plan.stages.reduce((sum, item) => sum + item.cost, 0) : 0;
    return `<section class="portal-page">${pageHeading("Pagos y presupuestos", "Consulta de saldos, presupuestos e historial. La integración de cobro debe realizarse con una pasarela segura.")}<div class="payment-hero"><div><span class="payment-hero__label">Saldo pendiente del paciente</span><strong class="payment-hero__amount">${formatMoney(balance)}</strong><span class="payment-hero__note">Importes demostrativos. Validar con administración antes de publicar.</span></div>${balance ? `<button class="button button--white" data-action="open-payment">Ver opciones de pago</button>` : `<span class="status-pill status-pill--confirmed">Cuenta al día</span>`}</div><div class="payment-grid"><article class="portal-card"><div class="portal-card__header"><div><h2>Movimientos</h2><p>Pagos registrados y vencimientos</p></div></div><div class="portal-card__body invoice-list">${items.length ? `${pending.map((item) => renderPaymentRow(item)).join("")}${paid.map((item) => renderPaymentRow(item)).join("")}` : `<div class="empty-state"><p>No hay movimientos.</p></div>`}</div></article><div><article class="portal-card"><div class="portal-card__header"><div><h2>Presupuesto activo</h2><p>${escapeHtml(plan?.title || "Sin plan")}</p></div></div><div class="portal-card__body"><div class="budget-card"><h3>${escapeHtml(plan?.title || "Sin presupuesto activo")}</h3><p>Estimación global de las etapas actualmente registradas.</p><div class="budget-card__price">${formatMoney(budgetTotal)}</div><button class="button button--soft button--full" data-action="navigate-health" data-tab="plan">Ver detalle del plan</button></div></div></article><article class="portal-card" style="margin-top:18px"><div class="portal-card__header"><div><h2>Medios de pago</h2><p>Configurar en producción</p></div></div><div class="portal-card__body info-list"><div class="info-row"><span>Transferencia</span><strong>Datos pendientes</strong></div><div class="info-row"><span>Tarjeta</span><strong>Pasarela pendiente</strong></div><div class="info-row"><span>En consultorio</span><strong>Confirmar disponibilidad</strong></div></div></article></div></div></section>`;
  }

  function renderPaymentRow(item) {
    const paid = item.status === "paid";
    return `<div class="invoice-row"><span class="invoice-row__icon">${paid ? "✓" : "$"}</span><div><h3>${escapeHtml(item.concept)}</h3><p>${paid ? `Pagado el ${formatShortDate(item.paidAt)} · ${escapeHtml(item.receipt || "Comprobante")}` : `Vence el ${formatShortDate(item.dueDate)}`}</p></div><div class="invoice-row__amount"><strong>${formatMoney(item.amount)}</strong><span class="status-pill status-pill--${paid ? "confirmed" : "pending"}">${paid ? "Pagado" : "Pendiente"}</span>${paid ? `<button class="text-link" style="margin-top:5px" data-action="download-receipt" data-id="${item.id}">Comprobante</button>` : ""}</div></div>`;
  }

  function renderProfile() {
    const tab = state.ui.profileTab || "personal";
    const patient = getActivePatient();
    const tabs = [
      { id: "personal", label: "Datos personales" },
      { id: "coverage", label: "Cobertura y salud" },
      { id: "family", label: "Grupo familiar" },
      { id: "security", label: "Seguridad y avisos" }
    ];
    return `<section class="portal-page">${pageHeading("Perfil y cobertura", "Información personal, pacientes vinculados, seguridad y preferencias de comunicación.")}<div class="profile-layout"><aside class="portal-card profile-summary"><div class="patient-avatar">${escapeHtml(patient.initials || initials(patient.name))}</div><div><h2>${escapeHtml(patient.name)}</h2><p>${escapeHtml(patient.relation)} · ${escapeHtml(patient.coverage)}</p><span class="profile-summary__status">Cuenta verificada</span></div><nav class="profile-menu">${tabs.map((item) => `<button class="${tab === item.id ? "is-active" : ""}" data-action="set-profile-tab" data-tab="${item.id}">${escapeHtml(item.label)}</button>`).join("")}</nav></aside><article class="portal-card profile-section">${tab === "personal" ? renderProfilePersonal(patient) : tab === "coverage" ? renderProfileCoverage(patient) : tab === "family" ? renderProfileFamily() : renderProfileSecurity()}</article></div></section>`;
  }

  function renderProfilePersonal(patient) {
    return `<h2>Datos personales</h2><p>Los cambios sensibles pueden requerir validación del consultorio.</p><form id="profileForm"><div class="form-grid"><div class="form-field"><label for="profileName">Nombre y apellido</label><input id="profileName" name="name" value="${escapeHtml(patient.name)}" required></div><div class="form-field"><label for="profileBirth">Fecha de nacimiento</label><input id="profileBirth" name="birthDate" type="date" value="${escapeHtml(patient.birthDate)}"></div><div class="form-field"><label for="profileEmail">Correo de acceso</label><input id="profileEmail" name="email" type="email" value="${escapeHtml(state.user.email)}" ${patient.id !== state.patients[0].id ? "disabled" : ""}></div><div class="form-field"><label for="profilePhone">Teléfono</label><input id="profilePhone" name="phone" value="${escapeHtml(state.user.phone)}" ${patient.id !== state.patients[0].id ? "disabled" : ""}></div><div class="form-field form-field--full"><label for="profileAddress">Dirección</label><input id="profileAddress" name="address" value="${escapeHtml(state.user.address)}" ${patient.id !== state.patients[0].id ? "disabled" : ""}></div></div><div class="form-actions"><button class="button button--primary" type="submit">Guardar cambios</button></div></form>`;
  }

  function renderProfileCoverage(patient) {
    return `<h2>Cobertura y datos de salud</h2><p>Información utilizada por el consultorio para validar atención y alertas.</p><div class="coverage-card"><img src="assets/icons/icon-cobertura.webp" alt=""><div><h3>${escapeHtml(patient.coverage)}</h3><p>Afiliado: ${escapeHtml(patient.memberNumber)}</p></div><button class="button button--soft button--compact" data-action="edit-coverage">Editar</button></div><div class="form-grid" style="margin-top:20px"><div class="form-field"><label>Grupo sanguíneo</label><input value="${escapeHtml(patient.bloodType)}" readonly></div><div class="form-field"><label>Alertas y alergias</label><input value="${escapeHtml(patient.alerts)}" readonly></div><div class="form-field form-field--full"><label>Observaciones médicas</label><textarea readonly>Sin observaciones adicionales en esta demostración.</textarea><small>En producción, solo personal autorizado debe editar esta información.</small></div></div>`;
  }

  function renderProfileFamily() {
    return `<h2>Grupo familiar</h2><p>Pacientes que podés administrar desde la misma cuenta. Cada vínculo debe validarse.</p><div class="family-list">${state.patients.map((patient) => `<div class="family-member"><span class="patient-avatar">${escapeHtml(patient.initials || initials(patient.name))}</span><div class="family-member__info"><strong>${escapeHtml(patient.name)}</strong><span>${escapeHtml(patient.relation)} · ${escapeHtml(patient.coverage)}</span></div>${patient.id === state.activePatientId ? `<span class="status-pill status-pill--confirmed">Activo</span>` : `<button class="button button--soft button--compact" data-action="select-patient" data-id="${patient.id}">Administrar</button>`}</div>`).join("")}</div><div class="security-note" style="margin-bottom:0"><span class="security-note__icon">i</span><p>Agregar nuevos familiares requiere validación de identidad, vínculo y autorización del consultorio. Esta acción no se habilita automáticamente desde el prototipo.</p></div>`;
  }

  function renderProfileSecurity() {
    const settings = state.settings;
    return `<h2>Seguridad y notificaciones</h2><p>La contraseña de DIVAR es diferente de la contraseña de Google.</p><div class="toggle-row"><div><strong>Recordatorios de turnos</strong><span>Recibir avisos antes de cada atención</span></div><label class="toggle"><input type="checkbox" data-setting="appointmentReminders" ${settings.appointmentReminders ? "checked" : ""}><span></span></label></div><div class="toggle-row"><div><strong>Avisos por correo</strong><span>Recibir cambios y confirmaciones</span></div><label class="toggle"><input type="checkbox" data-setting="emailNotifications" ${settings.emailNotifications ? "checked" : ""}><span></span></label></div><div class="toggle-row"><div><strong>Alertas de documentos</strong><span>Consentimientos, estudios y presupuestos</span></div><label class="toggle"><input type="checkbox" data-setting="documentAlerts" ${settings.documentAlerts ? "checked" : ""}><span></span></label></div><div class="toggle-row"><div><strong>Novedades del consultorio</strong><span>Información general no clínica</span></div><label class="toggle"><input type="checkbox" data-setting="marketing" ${settings.marketing ? "checked" : ""}><span></span></label></div><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px"><button class="button button--primary" data-action="change-password">Cambiar contraseña</button><button class="button button--soft" data-action="reset-demo">Restablecer datos de demostración</button></div>`;
  }

  function renderNotifications() {
    const panel = qs("#notificationList");
    if (!panel) return;
    const notifications = state.notifications.filter((notification) => notification.patientId === state.activePatientId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    panel.innerHTML = notifications.length ? notifications.map((notification) => `<button type="button" class="notification-item ${notification.read ? "" : "is-unread"}" data-action="open-notification" data-id="${notification.id}"><span class="notification-item__icon">${escapeHtml(notification.icon)}</span><span><strong>${escapeHtml(notification.title)}</strong><span>${escapeHtml(notification.text)}</span><time>${formatRelativeTime(notification.createdAt)}</time></span></button>`).join("") : `<div class="empty-state"><p>No hay notificaciones.</p></div>`;
  }

  function updateNotificationBadge() {
    const count = getUnreadCount();
    const badge = qs("#notificationCount");
    if (!badge) return;
    badge.textContent = String(count);
    badge.hidden = count === 0;
    renderNotifications();
  }

  function formatRelativeTime(value, short = false) {
    const diff = Date.now() - new Date(value).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Ahora";
    if (minutes < 60) return short ? `${minutes} min` : `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return short ? `${hours} h` : `Hace ${hours} h`;
    const days = Math.floor(hours / 24);
    return short ? `${days} d` : `Hace ${days} día${days === 1 ? "" : "s"}`;
  }

  function openModal(content, className = "") {
    const root = qs("#modalRoot");
    root.innerHTML = `<div class="modal-layer" data-action="modal-backdrop"><div class="modal-shell ${className}" role="dialog" aria-modal="true">${content}</div></div>`;
    document.body.classList.add("modal-open");
    setTimeout(() => {
      const focusTarget = qs("[autofocus]", root) || qs("input, button, select, textarea", root);
      focusTarget?.focus();
    }, 20);
  }

  function closeModal() {
    qs("#modalRoot").innerHTML = "";
    document.body.classList.remove("modal-open");
    bookingDraft = null;
  }

  function openLoginModal() {
    openModal(`<div class="auth-modal"><section class="auth-modal__visual"><div class="brand-lockup brand-lockup--light auth-brand"><img class="brand-lockup__mark" src="assets/brand/logo-symbol.webp" alt=""><span class="brand-lockup__text"><strong>DIVAR</strong><small>ODONTOLOGÍA</small></span></div><img class="auth-tooth" src="assets/illustrations/hero-tooth-shield.webp" alt=""><div class="auth-modal__visual-copy"><h2>Tu atención, organizada.</h2><p>Un único acceso para turnos, salud, documentos, mensajes y pagos.</p></div></section><section class="auth-modal__form"><button class="icon-button auth-close" data-action="close-modal" aria-label="Cerrar">×</button><span class="eyebrow">Portal de pacientes</span><h2>Ingresá a DIVAR</h2><p>Usá el correo registrado y la contraseña de DIVAR. Nunca ingreses la contraseña de Google.</p><form id="loginForm"><div class="form-field"><label for="loginEmail">Correo registrado</label><input id="loginEmail" name="email" type="email" placeholder="nombre@gmail.com" autocomplete="username" required autofocus></div><div class="form-field" style="margin-top:13px"><label for="loginPassword">Contraseña de DIVAR</label><div class="input-with-action"><input id="loginPassword" name="password" type="password" placeholder="Tu contraseña" autocomplete="current-password" required><button type="button" data-action="toggle-password" aria-label="Mostrar contraseña">👁</button></div></div><div class="auth-options"><label class="checkbox-label"><input type="checkbox" name="remember" checked> Mantener sesión iniciada</label><button type="button" data-action="forgot-password">Olvidé mi contraseña</button></div><button class="button button--primary button--full" type="submit">Ingresar</button><div id="loginError" class="form-error" hidden></div></form><div class="demo-access-card"><div class="demo-access-card__top"><strong>Accesos de demostración</strong><span class="status-pill status-pill--done">Solo prototipo</span></div><p>Podés entrar directo o probar el flujo de primera contraseña temporal.</p><div class="demo-access-card__buttons"><button type="button" data-action="login-demo">Entrar como paciente demo</button><button type="button" data-action="login-first-access">Probar primer acceso</button></div></div><div class="login-security-note"><span>🔒</span><p>La versión real necesita backend, cifrado, control de acceso y auditoría. Este HTML usa datos locales para demostrar el funcionamiento.</p></div></section></div>`, "modal-shell--wide");
  }

  function loginAs(mode) {
    const firstAccess = mode === "first";
    state.session = { userId: state.user.id, createdAt: new Date().toISOString(), firstAccess };
    state.user.email = firstAccess ? DEMO_CREDENTIALS.firstAccess.email : DEMO_CREDENTIALS.established.email;
    state.user.passwordChanged = !firstAccess;
    saveState();
    if (firstAccess) openFirstAccessModal();
    else {
      closeModal();
      navigate("dashboard");
      showToast("Sesión iniciada", "Ingresaste al portal de demostración.");
    }
  }

  function openFirstAccessModal() {
    openModal(`<div class="modal-header"><div><span class="eyebrow">Primer ingreso</span><h2>Creá tu contraseña de DIVAR</h2><p>La clave temporal queda invalidada después de este paso.</p></div></div><form id="firstAccessForm"><div class="modal-body"><div class="security-note" style="margin-top:0"><span class="security-note__icon">🔒</span><p>Esta contraseña es exclusiva para DIVAR. No debe coincidir necesariamente con la de tu correo y nunca debe ser solicitada por el consultorio.</p></div><div class="form-grid"><div class="form-field form-field--full"><label for="newPassword">Nueva contraseña</label><input id="newPassword" name="password" type="password" minlength="8" autocomplete="new-password" placeholder="Mínimo 8 caracteres" required autofocus></div><div class="form-field form-field--full"><label for="confirmPassword">Repetir contraseña</label><input id="confirmPassword" name="confirm" type="password" minlength="8" autocomplete="new-password" required></div><label class="checkbox-label form-field--full"><input type="checkbox" name="accept" required> Acepto los términos y el tratamiento de datos del portal (texto legal pendiente de configuración).</label></div><div id="firstAccessError" class="form-error" hidden></div></div><div class="modal-footer"><button class="button button--primary" type="submit">Activar mi cuenta</button></div></form>`);
  }

  function openFirstVisitModal() {
    openModal(`<div class="modal-header"><div><span class="eyebrow">Nuevos pacientes</span><h2>Solicitar primera consulta</h2><p>El consultorio recibe la solicitud, valida tus datos y luego puede habilitarte una cuenta.</p></div><button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button></div><div class="modal-body"><div class="first-visit-layout"><aside class="first-visit-info"><img src="assets/illustrations/hero-tooth-clean.webp" alt=""><h3>Primero, una consulta.</h3><p>No necesitás una cuenta para dejar tus datos. Una vez confirmado el vínculo, DIVAR puede enviarte un acceso temporal.</p><ul><li><span>✓</span> El correo puede ser Gmail u otro.</li><li><span>✓</span> No se solicita la contraseña del correo.</li><li><span>✓</span> La clave temporal pertenece a DIVAR.</li></ul></aside><form id="firstVisitForm"><div class="form-grid"><div class="form-field"><label for="firstVisitName">Nombre y apellido</label><input id="firstVisitName" name="name" required autofocus></div><div class="form-field"><label for="firstVisitEmail">Correo</label><input id="firstVisitEmail" name="email" type="email" required></div><div class="form-field"><label for="firstVisitPhone">Teléfono</label><input id="firstVisitPhone" name="phone" required></div><div class="form-field"><label for="firstVisitPatient">¿Para quién es?</label><select id="firstVisitPatient" name="patient"><option>Para mí</option><option>Para un menor a cargo</option><option>Para otro familiar</option></select></div><div class="form-field form-field--full"><label for="firstVisitReason">Motivo de consulta</label><select id="firstVisitReason" name="reason">${TREATMENTS.map((treatment) => `<option>${escapeHtml(treatment.name)}</option>`).join("")}<option>Otro / no estoy seguro</option></select></div><div class="form-field form-field--full"><label for="firstVisitMessage">Comentario opcional</label><textarea id="firstVisitMessage" name="message" placeholder="Contanos brevemente qué necesitás"></textarea></div></div><div class="form-actions"><button class="button button--soft" type="button" data-action="close-modal">Cancelar</button><button class="button button--primary" type="submit">Enviar solicitud</button></div></form></div></div>`, "modal-shell--wide");
  }

  function openTreatmentModal(treatmentId) {
    const treatment = getTreatment(treatmentId);
    openModal(`<div class="modal-header"><div><span class="eyebrow">${escapeHtml(treatment.category)}</span><h2>${escapeHtml(treatment.name)}</h2><p>Información general. La indicación requiere evaluación profesional.</p></div><button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button></div><div class="modal-body"><div class="booking-review"><div><p style="color:var(--ink-600);line-height:1.7">${escapeHtml(treatment.summary)} La duración estimada es ${escapeHtml(treatment.duration)} y puede variar según cada caso.</p><div class="info-list" style="margin-top:20px"><div class="info-row"><span>Categoría</span><strong>${escapeHtml(treatment.category)}</strong></div><div class="info-row"><span>Duración orientativa</span><strong>${escapeHtml(treatment.duration)}</strong></div><div class="info-row"><span>Profesional</span><strong>Según evaluación y disponibilidad</strong></div></div><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:24px"><button class="button button--primary" data-action="treatment-login-booking" data-treatment-id="${treatment.id}">Reservar como paciente</button><button class="button button--soft" data-action="open-first-visit">Soy nuevo paciente</button></div></div><div class="booking-review__image"><img src="${treatment.image}" alt="${escapeHtml(treatment.name)}"></div></div></div>`, "modal-shell--wide");
  }

  function openForgotPasswordModal() {
    openModal(`<div class="modal-header"><div><span class="eyebrow">Recuperación</span><h2>Restablecer contraseña</h2><p>En producción se enviaría un enlace de un solo uso al correo registrado.</p></div><button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button></div><form id="forgotPasswordForm"><div class="modal-body"><div class="form-field"><label for="recoveryEmail">Correo registrado</label><input id="recoveryEmail" name="email" type="email" placeholder="nombre@gmail.com" required autofocus></div><div class="security-note"><span class="security-note__icon">i</span><p>El consultorio no puede ver tu contraseña. El restablecimiento debe hacerse mediante un enlace temporal seguro.</p></div></div><div class="modal-footer"><button class="button button--soft" type="button" data-action="open-login">Volver</button><button class="button button--primary" type="submit">Enviar enlace</button></div></form>`);
  }

  function openSwitchPatientModal() {
    openModal(`<div class="modal-header"><div><span class="eyebrow">Grupo familiar</span><h2>Elegí el paciente</h2><p>Turnos, salud, documentos y pagos se filtran por el paciente activo.</p></div><button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button></div><div class="modal-body"><div class="selection-grid">${state.patients.map((patient) => `<button class="selection-card patient-selection-card ${patient.id === state.activePatientId ? "is-selected" : ""}" data-action="select-patient" data-id="${patient.id}"><span class="patient-avatar">${escapeHtml(patient.initials || initials(patient.name))}</span><span><strong>${escapeHtml(patient.name)}</strong><span>${escapeHtml(patient.relation)} · ${escapeHtml(patient.coverage)}</span></span></button>`).join("")}</div></div>`);
  }

  function openAppointmentDetails(id) {
    const appointment = state.appointments.find((item) => item.id === id);
    if (!appointment) return;
    const treatment = getTreatment(appointment.treatmentId);
    const professional = getProfessional(appointment.professionalId);
    const manageable = !["cancelled", "done"].includes(appointment.status) && appointment.date >= isoDate(new Date());
    openModal(`<div class="modal-header"><div><span class="eyebrow">Detalle del turno</span><h2>${escapeHtml(treatment.name)}</h2><p>${capitalize(formatDate(appointment.date, { year: "numeric" }))} · ${escapeHtml(appointment.time)} h</p></div><button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button></div><div class="modal-body"><div class="booking-review"><div class="booking-review__summary"><div class="review-row"><span>Paciente</span><strong>${escapeHtml(state.patients.find((patient) => patient.id === appointment.patientId)?.name || "Paciente")}</strong></div><div class="review-row"><span>Profesional</span><strong>${escapeHtml(professional.name)}</strong></div><div class="review-row"><span>Modalidad</span><strong>${escapeHtml(appointment.modality)}</strong></div><div class="review-row"><span>Lugar</span><strong>${escapeHtml(appointment.location)}</strong></div><div class="review-row"><span>Estado</span><strong>${escapeHtml({ confirmed: "Confirmado", pending: "Pendiente", cancelled: "Cancelado", done: "Completado" }[appointment.status])}</strong></div><div class="review-row"><span>Observaciones</span><strong>${escapeHtml(appointment.notes || "Sin observaciones")}</strong></div></div><div class="booking-review__image"><img src="${treatment.image}" alt="${escapeHtml(treatment.name)}"></div></div></div>${manageable ? `<div class="modal-footer"><button class="button button--danger" data-action="cancel-appointment" data-id="${appointment.id}">Cancelar</button><button class="button button--primary" data-action="reschedule-appointment" data-id="${appointment.id}">Reprogramar</button></div>` : ""}`, "modal-shell--wide");
  }

  function openBooking(existingAppointmentId = null, presetTreatmentId = null) {
    const existing = existingAppointmentId ? state.appointments.find((appointment) => appointment.id === existingAppointmentId) : null;
    bookingDraft = {
      mode: existing ? "reschedule" : "new",
      appointmentId: existing?.id || null,
      step: 0,
      patientId: existing?.patientId || state.activePatientId,
      treatmentId: existing?.treatmentId || presetTreatmentId || null,
      professionalId: existing?.professionalId || null,
      date: existing?.date || null,
      time: existing?.time || null,
      modality: existing?.modality || "Presencial",
      completed: false,
      newAppointmentId: null
    };
    renderBookingModal();
  }

  function renderBookingModal() {
    if (!bookingDraft) return;
    if (bookingDraft.completed) {
      const appointment = state.appointments.find((item) => item.id === bookingDraft.newAppointmentId);
      const treatment = getTreatment(appointment.treatmentId);
      const professional = getProfessional(appointment.professionalId);
      openModal(`<div class="modal-body confirmation-view"><div class="confirmation-icon">✓</div><h3>${bookingDraft.mode === "reschedule" ? "Turno reprogramado" : "Turno reservado"}</h3><p>La operación quedó registrada en esta demostración. En producción debe validarse contra la agenda real del consultorio.</p><div class="confirmation-ticket"><div class="confirmation-ticket__row"><span>Tratamiento</span><strong>${escapeHtml(treatment.name)}</strong></div><div class="confirmation-ticket__row"><span>Fecha y hora</span><strong>${capitalize(formatDate(appointment.date, { year: "numeric" }))} · ${escapeHtml(appointment.time)} h</strong></div><div class="confirmation-ticket__row"><span>Profesional</span><strong>${escapeHtml(professional.name)}</strong></div><div class="confirmation-ticket__row"><span>Modalidad</span><strong>${escapeHtml(appointment.modality)}</strong></div></div><div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:24px"><button class="button button--soft" data-action="close-modal">Cerrar</button><button class="button button--primary" data-action="booking-go-appointments">Ver mis turnos</button></div></div>`, "modal-shell--wide");
      return;
    }
    const stepLabels = ["Paciente", "Motivo", "Profesional", "Fecha y hora", "Confirmar"];
    const content = `<div class="modal-header"><div><span class="eyebrow">${bookingDraft.mode === "reschedule" ? "Reprogramación" : "Nueva reserva"}</span><h2>${bookingDraft.mode === "reschedule" ? "Reprogramar turno" : "Reservar turno"}</h2><p>Paso ${bookingDraft.step + 1} de 5 · ${stepLabels[bookingDraft.step]}</p></div><button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button></div><div class="modal-body"><div class="booking-progress">${stepLabels.map((label, index) => `<div class="booking-progress__step ${index < bookingDraft.step ? "is-complete" : index === bookingDraft.step ? "is-active" : ""}"><div class="booking-progress__line"><span></span></div><small>${label}</small></div>`).join("")}</div>${renderBookingStep()}</div><div class="modal-footer"><button class="button button--soft" data-action="booking-back" ${bookingDraft.step === 0 ? "disabled" : ""}>Atrás</button><button class="button button--primary" data-action="${bookingDraft.step === 4 ? "booking-confirm" : "booking-next"}">${bookingDraft.step === 4 ? (bookingDraft.mode === "reschedule" ? "Confirmar cambio" : "Confirmar turno") : "Continuar"}</button></div>`;
    openModal(content, "modal-shell--booking");
  }

  function renderBookingStep() {
    switch (bookingDraft.step) {
      case 0:
        return `<div class="booking-panel"><h3>¿Para quién es el turno?</h3><p>Elegí uno de los pacientes vinculados a tu cuenta.</p><div class="selection-grid">${state.patients.map((patient) => `<button class="selection-card patient-selection-card ${bookingDraft.patientId === patient.id ? "is-selected" : ""}" data-action="booking-select-patient" data-id="${patient.id}"><span class="patient-avatar">${escapeHtml(patient.initials || initials(patient.name))}</span><span><strong>${escapeHtml(patient.name)}</strong><span>${escapeHtml(patient.relation)} · ${escapeHtml(patient.coverage)}</span></span></button>`).join("")}</div></div>`;
      case 1:
        return `<div class="booking-panel"><h3>¿Cuál es el motivo?</h3><p>Podés elegir un tratamiento o “Consulta general” si todavía no tenés una indicación.</p><div class="selection-grid"><button class="selection-card ${bookingDraft.treatmentId === "consulta" ? "is-selected" : ""}" data-action="booking-select-treatment" data-id="consulta"><img src="assets/icons/icon-profesionales.webp" alt=""><strong>Consulta general</strong><span>Evaluación inicial o motivo no definido</span></button>${TREATMENTS.filter((treatment) => treatment.id !== "radiografias").slice(0, 8).map((treatment) => `<button class="selection-card ${bookingDraft.treatmentId === treatment.id ? "is-selected" : ""}" data-action="booking-select-treatment" data-id="${treatment.id}"><img src="${treatment.image}" alt=""><strong>${escapeHtml(treatment.name)}</strong><span>${escapeHtml(treatment.duration)}</span></button>`).join("")}</div></div>`;
      case 2: {
        const treatment = bookingDraft.treatmentId === "consulta" ? null : getTreatment(bookingDraft.treatmentId);
        const allowed = treatment ? PROFESSIONALS.filter((professional) => treatment.professionalIds.includes(professional.id) || treatment.professionalIds.includes("any")) : PROFESSIONALS.slice(0, 3);
        return `<div class="booking-panel"><h3>Elegí una preferencia profesional</h3><p>“Primer profesional disponible” prioriza el horario más cercano.</p><div class="selection-grid"><button class="selection-card professional-selection-card ${bookingDraft.professionalId === "any" ? "is-selected" : ""}" data-action="booking-select-professional" data-id="any"><img src="assets/professionals/professional-equipo-divar.webp" alt=""><strong>Primer profesional disponible</strong><span>Asignación según agenda y especialidad</span></button>${allowed.map((professional) => `<button class="selection-card professional-selection-card ${bookingDraft.professionalId === professional.id ? "is-selected" : ""}" data-action="booking-select-professional" data-id="${professional.id}"><img src="${professional.image}" alt=""><strong>${escapeHtml(professional.name)}</strong><span>${escapeHtml(professional.specialty)}</span></button>`).join("")}</div></div>`;
      }
      case 3: {
        const dates = generateBookingDates();
        const times = ["09:00", "09:30", "10:30", "11:30", "14:00", "15:30", "16:30", "18:00"];
        return `<div class="booking-panel"><h3>Elegí fecha y horario</h3><p>Disponibilidad simulada. En producción debe consultarse en tiempo real.</p><div class="date-time-layout"><div><h4 style="margin:0 0 10px;font-size:12px">Fechas disponibles</h4><div class="date-grid">${dates.map((date) => { const d = parseLocalDate(date); return `<button class="date-option ${bookingDraft.date === date ? "is-selected" : ""}" data-action="booking-select-date" data-date="${date}"><span>${new Intl.DateTimeFormat("es-AR", { weekday: "short" }).format(d)}</span><strong>${d.getDate()}</strong><span>${new Intl.DateTimeFormat("es-AR", { month: "short" }).format(d)}</span></button>`; }).join("")}</div><div style="margin-top:18px"><h4 style="margin:0 0 10px;font-size:12px">Modalidad</h4><div class="segmented-control"><button class="${bookingDraft.modality === "Presencial" ? "is-active" : ""}" data-action="booking-select-modality" data-value="Presencial">Presencial</button><button class="${bookingDraft.modality === "Videoconsulta" ? "is-active" : ""}" data-action="booking-select-modality" data-value="Videoconsulta">Videoconsulta</button></div></div></div><div><h4 style="margin:0 0 10px;font-size:12px">Horarios</h4><div class="time-grid">${times.map((time) => `<button class="time-option ${bookingDraft.time === time ? "is-selected" : ""}" data-action="booking-select-time" data-time="${time}">${time} h</button>`).join("")}</div><div class="security-note"><span class="security-note__icon">i</span><p>La videoconsulta sirve para orientación y seguimiento administrativo/clínico cuando el profesional lo indique; no reemplaza procedimientos presenciales.</p></div></div></div></div>`;
      }
      case 4: {
        const patient = state.patients.find((item) => item.id === bookingDraft.patientId);
        const treatment = bookingDraft.treatmentId === "consulta" ? { name: "Consulta general", image: "assets/illustrations/hero-tooth-control.webp" } : getTreatment(bookingDraft.treatmentId);
        const professional = getProfessional(bookingDraft.professionalId);
        return `<div class="booking-panel"><h3>Revisá la reserva</h3><p>Confirmá los datos antes de registrar el turno.</p><div class="booking-review"><div class="booking-review__summary"><div class="review-row"><span>Paciente</span><strong>${escapeHtml(patient?.name || "Paciente")}</strong></div><div class="review-row"><span>Motivo</span><strong>${escapeHtml(treatment.name)}</strong></div><div class="review-row"><span>Profesional</span><strong>${escapeHtml(professional.name)}</strong></div><div class="review-row"><span>Fecha</span><strong>${capitalize(formatDate(bookingDraft.date, { year: "numeric" }))}</strong></div><div class="review-row"><span>Horario</span><strong>${escapeHtml(bookingDraft.time)} h</strong></div><div class="review-row"><span>Modalidad</span><strong>${escapeHtml(bookingDraft.modality)}</strong></div></div><div class="booking-review__image"><img src="${treatment.image}" alt="${escapeHtml(treatment.name)}"></div></div></div>`;
      }
      default:
        return "";
    }
  }

  function generateBookingDates() {
    const dates = [];
    let cursor = 2;
    while (dates.length < 5) {
      const date = dateFromToday(cursor);
      const day = parseLocalDate(date).getDay();
      if (day !== 0) dates.push(date);
      cursor += 1;
    }
    if (bookingDraft.date && !dates.includes(bookingDraft.date) && bookingDraft.date >= isoDate(new Date())) dates.unshift(bookingDraft.date);
    return dates.slice(0, 5);
  }

  function validateBookingStep() {
    const checks = [bookingDraft.patientId, bookingDraft.treatmentId, bookingDraft.professionalId, bookingDraft.date && bookingDraft.time, true];
    if (!checks[bookingDraft.step]) {
      showToast("Falta información", "Completá una opción antes de continuar.", "error");
      return false;
    }
    return true;
  }

  function confirmBooking() {
    if (!validateBookingStep()) return;
    const existing = bookingDraft.appointmentId ? state.appointments.find((item) => item.id === bookingDraft.appointmentId) : null;
    if (existing) {
      existing.patientId = bookingDraft.patientId;
      existing.treatmentId = bookingDraft.treatmentId;
      existing.professionalId = bookingDraft.professionalId;
      existing.date = bookingDraft.date;
      existing.time = bookingDraft.time;
      existing.modality = bookingDraft.modality;
      existing.status = "confirmed";
      bookingDraft.newAppointmentId = existing.id;
    } else {
      const appointment = {
        id: uid("appt"),
        patientId: bookingDraft.patientId,
        treatmentId: bookingDraft.treatmentId,
        professionalId: bookingDraft.professionalId,
        date: bookingDraft.date,
        time: bookingDraft.time,
        modality: bookingDraft.modality,
        status: "confirmed",
        location: bookingDraft.modality === "Presencial" ? "Sede DIVAR · dirección a configurar" : "Enlace de videoconsulta pendiente",
        notes: bookingDraft.treatmentId === "consulta" ? "Consulta general." : "Reserva desde portal del paciente."
      };
      state.appointments.push(appointment);
      bookingDraft.newAppointmentId = appointment.id;
    }
    state.notifications.unshift({ id: uid("notification"), patientId: bookingDraft.patientId, title: bookingDraft.mode === "reschedule" ? "Turno reprogramado" : "Turno confirmado", text: `${formatShortDate(bookingDraft.date)} · ${bookingDraft.time} h`, route: "appointments", icon: "✓", createdAt: new Date().toISOString(), read: false });
    bookingDraft.completed = true;
    saveState();
    renderBookingModal();
  }

  function openCancelAppointmentModal(id) {
    const appointment = state.appointments.find((item) => item.id === id);
    if (!appointment) return;
    const treatment = getTreatment(appointment.treatmentId);
    openModal(`<div class="modal-header"><div><span class="eyebrow">Cancelar turno</span><h2>¿Confirmás la cancelación?</h2><p>${escapeHtml(treatment.name)} · ${capitalize(formatDate(appointment.date, { year: "numeric" }))} · ${escapeHtml(appointment.time)} h</p></div><button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button></div><div class="modal-body"><div class="security-note"><span class="security-note__icon">i</span><p>En producción, las reglas de cancelación deben informarse según la política real del consultorio.</p></div></div><div class="modal-footer"><button class="button button--soft" data-action="close-modal">Volver</button><button class="button button--danger" data-action="confirm-cancel-appointment" data-id="${appointment.id}">Cancelar turno</button></div>`);
  }

  function cancelAppointment(id) {
    const appointment = state.appointments.find((item) => item.id === id);
    if (!appointment) return;
    appointment.status = "cancelled";
    state.notifications.unshift({ id: uid("notification"), patientId: appointment.patientId, title: "Turno cancelado", text: `${formatShortDate(appointment.date)} · ${appointment.time} h`, route: "appointments", icon: "×", createdAt: new Date().toISOString(), read: false });
    saveState();
    closeModal();
    navigate("appointments");
    renderPortalChrome("appointments");
    renderPortalPage("appointments");
    showToast("Turno cancelado", "La reserva se movió al historial.");
  }

  function openEmergencyModal() {
    openModal(`<div class="modal-header"><div><span class="eyebrow">Atención prioritaria</span><h2>Urgencias odontológicas</h2><p>Los canales reales deben configurarse antes de publicar.</p></div><button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button></div><div class="modal-body"><div class="booking-review"><div><div class="security-note" style="margin-top:0"><span class="security-note__icon">!</span><p>Dolor intenso, traumatismos, sangrado persistente, inflamación importante o dificultad para respirar requieren evaluación profesional. Ante una emergencia general, contactá al servicio de emergencias de tu zona.</p></div><div class="info-list"><div class="info-row"><span>WhatsApp de guardia</span><strong>Pendiente de configuración</strong></div><div class="info-row"><span>Teléfono</span><strong>Pendiente de configuración</strong></div><div class="info-row"><span>Horario</span><strong>Pendiente de configuración</strong></div></div></div><div class="booking-review__image"><img src="assets/treatments/treatment-urgencias.webp" alt="Urgencias odontológicas"></div></div></div><div class="modal-footer"><button class="button button--primary" data-action="close-modal">Entendido</button></div>`, "modal-shell--wide");
  }

  function openPaymentModal() {
    const pending = state.payments.filter((payment) => payment.patientId === state.activePatientId && payment.status === "pending");
    const balance = pending.reduce((sum, item) => sum + item.amount, 0);
    openModal(`<div class="modal-header"><div><span class="eyebrow">Pago seguro</span><h2>Saldo pendiente: ${formatMoney(balance)}</h2><p>Demostración del flujo. No se procesan datos bancarios.</p></div><button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button></div><div class="modal-body"><div class="selection-grid"><button class="selection-card is-selected" data-action="select-payment-method" data-method="transfer"><img src="assets/icons/icon-pagos.webp" alt=""><strong>Transferencia</strong><span>Datos bancarios a configurar</span></button><button class="selection-card" data-action="select-payment-method" data-method="card"><img src="assets/icons/icon-pagos.webp" alt=""><strong>Tarjeta</strong><span>Requiere pasarela de pago</span></button><button class="selection-card" data-action="select-payment-method" data-method="clinic"><img src="assets/icons/icon-pagos.webp" alt=""><strong>En consultorio</strong><span>Coordinar con recepción</span></button></div><div class="security-note"><span class="security-note__icon">🔒</span><p>La aplicación no debe almacenar números completos de tarjeta. El pago en producción debe delegarse a un proveedor certificado.</p></div></div><div class="modal-footer"><button class="button button--soft" data-action="close-modal">Cancelar</button><button class="button button--primary" data-action="simulate-payment">Simular pago</button></div>`);
  }

  function openCoverageModal() {
    const patient = getActivePatient();
    openModal(`<div class="modal-header"><div><span class="eyebrow">Cobertura</span><h2>Actualizar información</h2><p>En producción puede requerir validación y adjuntar credencial.</p></div><button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button></div><form id="coverageForm"><div class="modal-body"><div class="form-grid"><div class="form-field"><label for="coverageName">Obra social / prepaga</label><input id="coverageName" name="coverage" value="${escapeHtml(patient.coverage)}" required></div><div class="form-field"><label for="memberNumber">Número de afiliado</label><input id="memberNumber" name="memberNumber" value="${escapeHtml(patient.memberNumber)}" required></div><div class="form-field form-field--full"><label>Credencial</label><input type="file" accept="image/*,.pdf"><small>El archivo no se guarda en este prototipo.</small></div></div></div><div class="modal-footer"><button class="button button--soft" type="button" data-action="close-modal">Cancelar</button><button class="button button--primary" type="submit">Guardar</button></div></form>`);
  }

  function openChangePasswordModal() {
    openModal(`<div class="modal-header"><div><span class="eyebrow">Seguridad</span><h2>Cambiar contraseña</h2><p>La contraseña es exclusiva para DIVAR.</p></div><button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button></div><form id="changePasswordForm"><div class="modal-body"><div class="form-grid"><div class="form-field form-field--full"><label>Contraseña actual</label><input name="current" type="password" required autofocus></div><div class="form-field"><label>Nueva contraseña</label><input name="password" type="password" minlength="8" required></div><div class="form-field"><label>Repetir contraseña</label><input name="confirm" type="password" minlength="8" required></div></div><div id="passwordError" class="form-error" hidden></div></div><div class="modal-footer"><button class="button button--soft" type="button" data-action="close-modal">Cancelar</button><button class="button button--primary" type="submit">Actualizar</button></div></form>`);
  }

  function openDocumentModal(id) {
    const document = state.documents.find((item) => item.id === id);
    if (!document) return;
    openModal(`<div class="modal-header"><div><span class="eyebrow">${escapeHtml(document.type)}</span><h2>${escapeHtml(document.name)}</h2><p>${escapeHtml(document.fileName)} · ${escapeHtml(document.size)}</p></div><button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button></div><div class="modal-body"><div class="empty-state"><span style="font-size:54px">▤</span><h3>Vista previa demostrativa</h3><p>El prototipo conserva solo metadatos. Para ver archivos reales, deben almacenarse en un backend seguro con permisos por paciente.</p><button class="button button--soft" data-action="fake-download-document" data-id="${document.id}">Descargar archivo</button></div></div>`);
  }

  function openSignDocumentModal(id) {
    const document = state.documents.find((item) => item.id === id);
    if (!document) return;
    openModal(`<div class="modal-header"><div><span class="eyebrow">Revisión de documento</span><h2>${escapeHtml(document.name)}</h2><p>Texto legal de demostración. Debe reemplazarse por el consentimiento real.</p></div><button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button></div><div class="modal-body"><div style="max-height:260px;overflow:auto;padding:16px;border:1px solid var(--ink-200);border-radius:16px;background:var(--ink-50);color:var(--ink-600);font-size:10px;line-height:1.65"><strong>Consentimiento informado — contenido pendiente</strong><p>Este bloque representa el documento que el paciente debería leer antes de aceptar. La firma electrónica real debe cumplir los requisitos legales y de trazabilidad aplicables.</p><p>No se debe publicar este texto como consentimiento definitivo.</p></div><label class="checkbox-label" style="margin-top:16px"><input id="documentAcceptance" type="checkbox"> Leí el documento demostrativo y deseo marcarlo como revisado.</label></div><div class="modal-footer"><button class="button button--soft" data-action="close-modal">Cancelar</button><button class="button button--primary" data-action="confirm-sign-document" data-id="${document.id}">Marcar como revisado</button></div>`);
  }

  function showToast(title, message, type = "success") {
    const region = qs("#toastRegion");
    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "toast--error" : ""}`;
    toast.innerHTML = `<span class="toast__icon">${type === "error" ? "!" : "✓"}</span><span><strong>${escapeHtml(title)}</strong><span>${escapeHtml(message)}</span></span>`;
    region.appendChild(toast);
    setTimeout(() => toast.remove(), 4200);
  }

  function closeSidebar() {
    qs("#portalSidebar")?.classList.remove("is-open");
    const scrim = qs("#sidebarScrim");
    if (scrim) scrim.hidden = true;
  }

  function openSidebar() {
    qs("#portalSidebar")?.classList.add("is-open");
    const scrim = qs("#sidebarScrim");
    if (scrim) scrim.hidden = false;
  }

  function closeNotifications() {
    const panel = qs("#notificationPanel");
    if (panel) panel.hidden = true;
  }

  function toggleNotifications() {
    const panel = qs("#notificationPanel");
    panel.hidden = !panel.hidden;
    if (!panel.hidden) renderNotifications();
  }

  function handleLoginSubmit(form) {
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim().toLowerCase();
    const password = String(data.get("password") || "");
    const error = qs("#loginError");
    if (email === DEMO_CREDENTIALS.established.email && password === DEMO_CREDENTIALS.established.password) {
      loginAs("established");
      return;
    }
    if (email === DEMO_CREDENTIALS.firstAccess.email && password === DEMO_CREDENTIALS.firstAccess.password) {
      loginAs("first");
      return;
    }
    error.hidden = false;
    error.textContent = `Para esta demostración usá “Entrar como paciente demo” o las credenciales ${DEMO_CREDENTIALS.established.email} / ${DEMO_CREDENTIALS.established.password}.`;
  }

  function handleFirstAccessSubmit(form) {
    const data = new FormData(form);
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");
    const error = qs("#firstAccessError");
    if (password.length < 8 || password !== confirm) {
      error.hidden = false;
      error.textContent = "Las contraseñas deben coincidir y tener al menos 8 caracteres.";
      return;
    }
    state.user.passwordChanged = true;
    state.session.firstAccess = false;
    saveState();
    closeModal();
    navigate("dashboard");
    showToast("Cuenta activada", "Tu contraseña temporal quedó reemplazada.");
  }

  function handleFirstVisitSubmit(form) {
    const data = new FormData(form);
    closeModal();
    showToast("Solicitud enviada", `Gracias, ${data.get("name")}. El consultorio deberá contactarte y validar tus datos.`);
  }

  function handleProfileSubmit(form) {
    const data = new FormData(form);
    const patient = getActivePatient();
    patient.name = String(data.get("name") || patient.name);
    patient.birthDate = String(data.get("birthDate") || patient.birthDate);
    patient.initials = initials(patient.name);
    if (patient.id === state.patients[0].id) {
      state.user.name = patient.name;
      state.user.email = String(data.get("email") || state.user.email);
      state.user.phone = String(data.get("phone") || state.user.phone);
      state.user.address = String(data.get("address") || state.user.address);
    }
    saveState();
    renderPortalChrome("profile");
    renderPortalPage("profile");
    showToast("Perfil actualizado", "Los cambios se guardaron en esta demostración.");
  }

  function handleCoverageSubmit(form) {
    const data = new FormData(form);
    const patient = getActivePatient();
    patient.coverage = String(data.get("coverage") || patient.coverage);
    patient.memberNumber = String(data.get("memberNumber") || patient.memberNumber);
    saveState();
    closeModal();
    renderPortalChrome("profile");
    renderPortalPage("profile");
    showToast("Cobertura actualizada", "El consultorio deberá validar los datos reales.");
  }

  function handleMessageSubmit(form) {
    const textarea = qs("#messageInput", form);
    const text = textarea.value.trim();
    if (!text) return;
    state.messages.push({ id: uid("msg"), patientId: state.activePatientId, sender: "user", author: getActivePatient().name, text, createdAt: new Date().toISOString(), read: true });
    saveState();
    renderPortalPage("messages");
    requestAnimationFrame(() => {
      const chat = qs("#chatMessages");
      if (chat) chat.scrollTop = chat.scrollHeight;
    });
    setTimeout(() => {
      state.messages.push({ id: uid("msg"), patientId: state.activePatientId, sender: "clinic", author: "Recepción DIVAR", text: "Recibimos tu mensaje. En una integración real, el equipo respondería desde el panel del consultorio.", createdAt: new Date().toISOString(), read: false });
      state.notifications.unshift({ id: uid("notification"), patientId: state.activePatientId, title: "Nuevo mensaje", text: "Recepción DIVAR respondió tu consulta.", route: "messages", icon: "●", createdAt: new Date().toISOString(), read: false });
      saveState();
      if (currentRoute() === "messages") renderPortalPage("messages");
      updateNotificationBadge();
    }, 900);
  }

  function handleFileUpload(files) {
    const valid = [...files].filter((file) => file.size <= 12 * 1024 * 1024);
    if (!valid.length) {
      showToast("Archivo no válido", "Elegí imágenes o PDF de hasta 12 MB.", "error");
      return;
    }
    valid.forEach((file) => {
      state.documents.unshift({ id: uid("doc"), patientId: state.activePatientId, name: file.name.replace(/\.[^.]+$/, ""), type: file.type.includes("pdf") ? "Documento PDF" : "Imagen / estudio", fileName: file.name, date: isoDate(new Date()), size: `${Math.max(1, Math.round(file.size / 1024))} KB`, status: "available" });
    });
    saveState();
    state.ui.healthTab = "documents";
    if (currentRoute() === "health") renderPortalPage("health");
    showToast("Archivo registrado", "En este prototipo se guardaron los metadatos del archivo.");
  }

  function handleHashChange() {
    const route = currentRoute();
    if (route && state.session) showPortal(route);
    else if (route && !state.session) {
      history.replaceState(null, "", "#inicio");
      showPublicSite();
      openLoginModal();
    } else showPublicSite();
  }

  function handleClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    if (action !== "modal-backdrop") event.preventDefault();

    switch (action) {
      case "open-login": closeModal(); openLoginModal(); break;
      case "open-first-visit": closeModal(); openFirstVisitModal(); break;
      case "open-demo": loginAs("established"); break;
      case "close-modal": closeModal(); break;
      case "modal-backdrop": if (event.target === target) closeModal(); break;
      case "toggle-public-menu": {
        const menu = qs("#mobilePublicMenu");
        menu.hidden = !menu.hidden;
        target.setAttribute("aria-expanded", String(!menu.hidden));
        break;
      }
      case "show-all-treatments": publicTreatmentsExpanded = !publicTreatmentsExpanded; renderPublicTreatments(); break;
      case "open-treatment": openTreatmentModal(target.dataset.treatmentId); break;
      case "toggle-faq": {
        const item = target.closest(".faq-item");
        const answer = qs(".faq-item__answer", item);
        const open = !item.classList.contains("is-open");
        item.classList.toggle("is-open", open);
        answer.hidden = !open;
        target.setAttribute("aria-expanded", String(open));
        break;
      }
      case "toggle-password": {
        const input = target.closest(".input-with-action")?.querySelector("input");
        if (input) input.type = input.type === "password" ? "text" : "password";
        break;
      }
      case "forgot-password": openForgotPasswordModal(); break;
      case "login-demo": loginAs("established"); break;
      case "login-first-access": loginAs("first"); break;
      case "navigate": navigate(target.dataset.route); break;
      case "navigate-health": state.ui.healthTab = target.dataset.tab || "plan"; saveState(); navigate("health"); break;
      case "open-sidebar": openSidebar(); break;
      case "close-sidebar": closeSidebar(); break;
      case "toggle-notifications": toggleNotifications(); break;
      case "mark-notifications-read": state.notifications.filter((item) => item.patientId === state.activePatientId).forEach((item) => { item.read = true; }); saveState(); updateNotificationBadge(); break;
      case "open-notification": {
        const notification = state.notifications.find((item) => item.id === target.dataset.id);
        if (notification) {
          notification.read = true;
          if (notification.healthTab) state.ui.healthTab = notification.healthTab;
          saveState();
          closeNotifications();
          navigate(notification.route);
        }
        break;
      }
      case "switch-patient": openSwitchPatientModal(); break;
      case "select-patient": {
        state.activePatientId = target.dataset.id;
        saveState();
        closeModal();
        const route = currentRoute() || "dashboard";
        renderPortalChrome(route);
        renderPortalPage(route);
        showToast("Paciente activo", `Ahora estás gestionando a ${getActivePatient().name}.`);
        break;
      }
      case "logout": state.session = null; saveState(); location.hash = "#inicio"; showToast("Sesión cerrada", "Saliste del portal."); break;
      case "open-booking": openBooking(); break;
      case "treatment-login-booking": {
        const treatmentId = target.dataset.treatmentId;
        closeModal();
        if (state.session) { navigate("appointments"); setTimeout(() => openBooking(null, treatmentId), 50); }
        else { openLoginModal(); showToast("Ingresá primero", "Después podrás reservar el tratamiento seleccionado."); }
        break;
      }
      case "set-appointment-filter": state.ui.appointmentFilter = target.dataset.filter; saveState(); renderPortalPage("appointments"); break;
      case "appointment-details": openAppointmentDetails(target.dataset.id); break;
      case "reschedule-appointment": closeModal(); openBooking(target.dataset.id); break;
      case "cancel-appointment": closeModal(); openCancelAppointmentModal(target.dataset.id); break;
      case "confirm-cancel-appointment": cancelAppointment(target.dataset.id); break;
      case "set-health-tab": state.ui.healthTab = target.dataset.tab; saveState(); renderPortalPage("health"); break;
      case "upload-document": qs("#documentUploadInput").click(); break;
      case "view-document": openDocumentModal(target.dataset.id); break;
      case "fake-download-document": showToast("Descarga simulada", "La descarga real requiere almacenamiento seguro."); break;
      case "sign-document": openSignDocumentModal(target.dataset.id); break;
      case "confirm-sign-document": {
        const checkbox = qs("#documentAcceptance");
        if (!checkbox?.checked) { showToast("Falta aceptar", "Marcá la casilla para continuar.", "error"); break; }
        const document = state.documents.find((item) => item.id === target.dataset.id);
        if (document) document.status = "available";
        saveState(); closeModal(); renderPortalPage("health"); showToast("Documento revisado", "El estado se actualizó en la demostración.");
        break;
      }
      case "print-page": window.print(); break;
      case "message-topic": { const input = qs("#messageInput"); if (input) { input.value = target.dataset.text || ""; input.focus(); } break; }
      case "open-payment": openPaymentModal(); break;
      case "select-payment-method": qsa('[data-action="select-payment-method"]').forEach((button) => button.classList.toggle("is-selected", button === target)); break;
      case "simulate-payment": {
        state.payments.filter((payment) => payment.patientId === state.activePatientId && payment.status === "pending").forEach((payment) => { payment.status = "paid"; payment.paidAt = isoDate(new Date()); payment.receipt = `REC-${Math.floor(Math.random() * 90000 + 10000)}`; });
        saveState(); closeModal(); renderPortalPage("payments"); showToast("Pago simulado", "El saldo quedó actualizado solo en este prototipo.");
        break;
      }
      case "download-receipt": showToast("Comprobante", "La descarga real se conectará al sistema administrativo."); break;
      case "set-profile-tab": state.ui.profileTab = target.dataset.tab; saveState(); renderPortalPage("profile"); break;
      case "edit-coverage": openCoverageModal(); break;
      case "change-password": openChangePasswordModal(); break;
      case "reset-demo": {
        if (confirm("¿Restablecer todos los datos locales de demostración?")) { resetDemoState(); state.session = { userId: state.user.id, createdAt: new Date().toISOString(), firstAccess: false }; saveState(); renderPortalChrome("profile"); renderPortalPage("profile"); showToast("Datos restablecidos", "La demostración volvió al estado inicial."); }
        break;
      }
      case "open-emergency": openEmergencyModal(); break;
      case "booking-select-patient": bookingDraft.patientId = target.dataset.id; renderBookingModal(); break;
      case "booking-select-treatment": bookingDraft.treatmentId = target.dataset.id; bookingDraft.professionalId = null; renderBookingModal(); break;
      case "booking-select-professional": bookingDraft.professionalId = target.dataset.id; renderBookingModal(); break;
      case "booking-select-date": bookingDraft.date = target.dataset.date; renderBookingModal(); break;
      case "booking-select-time": bookingDraft.time = target.dataset.time; renderBookingModal(); break;
      case "booking-select-modality": bookingDraft.modality = target.dataset.value; renderBookingModal(); break;
      case "booking-next": if (validateBookingStep()) { bookingDraft.step += 1; renderBookingModal(); } break;
      case "booking-back": if (bookingDraft.step > 0) { bookingDraft.step -= 1; renderBookingModal(); } break;
      case "booking-confirm": confirmBooking(); break;
      case "booking-go-appointments": closeModal(); navigate("appointments"); break;
      case "install-app": installApp(); break;
      default: break;
    }
  }

  function handleSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();
    switch (form.id) {
      case "loginForm": handleLoginSubmit(form); break;
      case "firstAccessForm": handleFirstAccessSubmit(form); break;
      case "firstVisitForm": handleFirstVisitSubmit(form); break;
      case "forgotPasswordForm": closeModal(); showToast("Enlace solicitado", "En producción se enviaría un correo temporal."); break;
      case "profileForm": handleProfileSubmit(form); break;
      case "coverageForm": handleCoverageSubmit(form); break;
      case "messageForm": handleMessageSubmit(form); break;
      case "changePasswordForm": {
        const data = new FormData(form);
        const password = String(data.get("password") || "");
        const confirmPassword = String(data.get("confirm") || "");
        const error = qs("#passwordError");
        if (password.length < 8 || password !== confirmPassword) { error.hidden = false; error.textContent = "Las contraseñas deben coincidir y tener al menos 8 caracteres."; return; }
        closeModal(); showToast("Contraseña actualizada", "En producción este cambio debe ejecutarse en el backend seguro.");
        break;
      }
      default: break;
    }
  }

  function handleChange(event) {
    const target = event.target;
    if (target === qs("#documentUploadInput")) {
      handleFileUpload(target.files);
      target.value = "";
      return;
    }
    if (target.matches("[data-setting]")) {
      state.settings[target.dataset.setting] = target.checked;
      saveState();
      showToast("Preferencia actualizada", "La configuración quedó guardada.");
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      if (qs("#modalRoot").children.length) closeModal();
      else if (!qs("#notificationPanel").hidden) closeNotifications();
      else closeSidebar();
    }
    if ((event.key === "Enter" || event.key === " ") && event.target.matches('.treatment-card[data-action="open-treatment"]')) {
      event.preventDefault();
      openTreatmentModal(event.target.dataset.treatmentId);
    }
  }

  function setupPwa() {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      setInstallButtonsHidden(false);
    });
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("./sw.js").catch((error) => console.warn("Service worker no registrado:", error));
    }
  }

  async function installApp() {
    if (!deferredInstallPrompt) {
      showToast("Instalación", "Usá la opción “Instalar aplicación” del navegador cuando esté disponible.");
      return;
    }
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    setInstallButtonsHidden(true);
  }

  /* El topbar no tiene lugar para el botón en pantallas chicas, así que la
     acción vive también en el menú hamburguesa y en el menú lateral. */
  function setInstallButtonsHidden(hidden) {
    ["#installAppButton", "#installAppButtonPublic", "#installAppButtonSidebar"].forEach((selector) => {
      const button = qs(selector);
      if (button) button.hidden = hidden;
    });
  }

  function init() {
    qs("#currentYear").textContent = String(new Date().getFullYear());
    renderPublicContent();
    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);
    document.addEventListener("change", handleChange);
    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("scroll", () => qs("#siteHeader")?.classList.toggle("is-scrolled", window.scrollY > 24), { passive: true });
    setupPwa();
    handleHashChange();
  }

  init();
})();
