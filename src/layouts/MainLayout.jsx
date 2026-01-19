import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import {
  FiMail,
  FiTool,
  FiLogIn,
  FiMonitor,
  FiLayers,
  FiGrid,
  FiDatabase,
  FiTag,
  FiShield,
  FiServer,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  console.log("user", user);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState({});

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const toggleMobileSubMenu = (menu) => {
    setExpandedMobileMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const MobileMenuItem = ({ icon: Icon, label, children, menuId, onClick }) => {
    const isExpanded = expandedMobileMenus[menuId];
    const hasChildren = !!children;

    return (
      <div className="border-b border-slate-800/50">
        <div
          className="flex items-center justify-between p-4 text-slate-300 hover:bg-slate-800 cursor-pointer"
          onClick={() => {
            if (hasChildren) {
              toggleMobileSubMenu(menuId);
            } else if (onClick) {
              onClick();
              setIsMobileMenuOpen(false);
            }
          }}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="text-lg" />}
            <span className="font-medium">{label}</span>
          </div>
          {hasChildren && (
            <FiChevronDown className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          )}
        </div>
        {hasChildren && (
          <div className={`bg-slate-900/50 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#181c20] text-slate-100">
      <header className="bg-[#343a40] border-b border-slate-800 sticky top-0 z-50">
        <div className="px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-slate-300 hover:text-white mr-4"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <div className="text-xl font-bold text-white">MJ</div>

            {/* NAV */}
            <nav className="hidden md:flex items-center space-x-6 text-sm text-slate-300 text-[rgba(255,255,255,.5)]">
              <div className="flex flex-col items-center gap-1 hover:text-white cursor-pointer" onClick={() => navigate('/dashboard')}>
                <FiMail className="text-lg" />
                <span className="text-xs">SMTP</span>
              </div>

              <div className="relative group h-16 flex items-center cursor-pointer">
                <span className="flex flex-col items-center gap-1 group-hover:text-white">
                  <FiTool />
                  TOOLS ▾
                </span>
                <div
                  className="absolute top-full left-0 w-56 bg-white text-slate-900 shadow-xl rounded-md
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50"
                >
                  <div className="py-2">
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      Data File List
                    </div>
                  </div>
                </div>
              </div>

              {/* LOGIN */}
              <div className="relative group h-16 flex items-center cursor-pointer">
                <span className="flex flex-col items-center gap-1 group-hover:text-white">
                  <FiLogIn />
                  LOGIN ▾
                </span>
                <div
                  className="absolute top-full left-0 w-56 bg-white text-slate-900 shadow-xl rounded-md
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50"
                >
                  <div className="py-2">
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer" onClick={() => navigate('/login')}>
                      Create Credentials
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1 hover:text-white cursor-pointer">
                <FiMonitor />
                <span>SCREEN</span>
              </div>

              <div className="relative group h-16 flex items-center cursor-pointer">
                <span className="flex flex-col items-center gap-1 group-hover:text-white">
                  <FiLayers />
                  INTERFACE ▾
                </span>

                <div
                  className="absolute top-full left-0 w-72 bg-white text-slate-900 shadow-xl rounded-md
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50"
                >
                  <div className="py-2">
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer" onClick={() => navigate('/campaigns')}>
                      CAMPAIGNS
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer" onClick={() => navigate('/users')}>
                      USERS
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer" onClick={() => navigate('/activity')}>
                      ACTIVITY LOGS
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      ----------------
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      MAIN SERVER
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer" onClick={() => navigate("campaigns/new")}>
                      NEW INTERFACE
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      SMTP TESTER
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      FSOCK MANUAL INTERFACE
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      NEW INTERFACE AUTO
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      FSOCK SEND SMTP
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      FSOCK SEND SMTP AUTO
                    </div>

                    {/* Divider */}
                    <div className="my-2 border-t border-slate-200" />

                    {/* ================= SENDING IP ================= */}
                    <div className="relative group/sending">
                      {/* Heading */}
                      <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">
                        SENDING IP
                      </div>

                      {/* NEW INTERFACE → IPs */}
                      <div className="relative group/ni">
                        <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex justify-between items-center">
                          <span>NEW INTERFACE</span>
                          <span>▸</span>
                        </div>

                        <div
                          className="absolute top-0 left-full w-64 bg-white text-slate-900 shadow-xl rounded-md
                 opacity-0 invisible group-hover/ni:opacity-100 group-hover/ni:visible
                 transition z-50"
                        >
                          <div className="py-2">
                            {[
                              "157.173.122.179",
                              "157.173.122.188",
                              "185.249.225.156",
                              "185.249.225.93",
                              "38.242.197.199",
                            ].map((ip) => (
                              <div
                                key={ip}
                                className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
                              >
                                {ip}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Other Sending IP items */}
                      {/* SMTP TESTER */}
                      <div className="relative group/st">
                        <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex justify-between items-center">
                          <span>SMTP TESTER</span>
                          <span>▸</span>
                        </div>

                        <div
                          className="absolute top-0 left-full w-64 bg-white text-slate-900 shadow-xl rounded-md
               opacity-0 invisible group-hover/st:opacity-100 group-hover/st:visible
               transition z-50"
                        >
                          <div className="py-2">
                            <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                              157.173.122.179
                            </div>
                            <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                              157.173.122.188
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* FSOCK MANUAL INTERFACE */}
                      <div className="relative group/fm">
                        <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex justify-between items-center">
                          <span>FSOCK MANUAL INTERFACE</span>
                          <span>▸</span>
                        </div>

                        <div
                          className="absolute top-0 left-full w-64 bg-white text-slate-900 shadow-xl rounded-md
               opacity-0 invisible group-hover/fm:opacity-100 group-hover/fm:visible
               transition z-50"
                        >
                          <div className="py-2">
                            <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                              185.249.225.156
                            </div>
                            <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                              185.249.225.93
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* NEW INTERFACE AUTO */}
                      <div className="relative group/nia">
                        <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex justify-between items-center">
                          <span>NEW INTERFACE AUTO</span>
                          <span>▸</span>
                        </div>

                        <div
                          className="absolute top-0 left-full w-64 bg-white text-slate-900 shadow-xl rounded-md
               opacity-0 invisible group-hover/nia:opacity-100 group-hover/nia:visible
               transition z-50"
                        >
                          <div className="py-2">
                            <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                              38.242.197.199
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* FSOCK SEND SMTP */}
                      <div className="relative group/fss">
                        <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex justify-between items-center">
                          <span>FSOCK SEND SMTP</span>
                          <span>▸</span>
                        </div>

                        <div
                          className="absolute top-0 left-full w-64 bg-white text-slate-900 shadow-xl rounded-md
               opacity-0 invisible group-hover/fss:opacity-100 group-hover/fss:visible
               transition z-50"
                        >
                          <div className="py-2">
                            <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                              smtp001
                            </div>
                            <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                              smtp002
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* FSOCK SEND SMTP AUTO */}
                      <div className="relative group/fssa">
                        <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex justify-between items-center">
                          <span>FSOCK SEND SMTP AUTO</span>
                          <span>▸</span>
                        </div>

                        <div
                          className="absolute top-0 left-full w-64 bg-white text-slate-900 shadow-xl rounded-md
               opacity-0 invisible group-hover/fssa:opacity-100 group-hover/fssa:visible
               transition z-50"
                        >
                          <div className="py-2">
                            <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                              smtp-auto-01
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TESTIDS PORTAL */}
              <div className="relative group h-16 flex items-center cursor-pointer">
                <span className="flex flex-col items-center gap-1 group-hover:text-white">
                  <FiGrid />
                  TESTIDS PORTAL ▾
                </span>

                <div
                  className="absolute top-full left-0 w-56 bg-white text-slate-900 shadow-xl rounded-md
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50"
                >
                  <div className="py-2">
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      Testids Management
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      Testids Screen
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      Testids Mailbox
                    </div>
                  </div>
                </div>
              </div>

              {/* DATA */}
              <div className="relative group h-16 flex items-center cursor-pointer">
                <span className="flex flex-col items-center gap-1 group-hover:text-white">
                  <FiDatabase />
                  DATA ▾
                </span>
                <div
                  className="absolute top-full left-0 w-72 bg-white text-slate-900 shadow-xl rounded-md
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50"
                >
                  <div className="py-2">
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      DATA DOWNLOAD PORTAL
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      DATA UPLOAD PORTAL
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      DATA SPLIT PORTAL
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      BOUNCE FETCH
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      COMPLAIN FETCH
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      BOUNCE UPDATE
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      COMPLAIN UPDATE
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      Fetch Opener & Clicker Data
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      DELETE DATAFILE FROM DB
                    </div>
                  </div>
                </div>
              </div>

              {/* OFFER */}
              <div className="relative group h-16 flex items-center cursor-pointer">
                <span className="flex flex-col items-center gap-1 group-hover:text-white">
                  <FiTag />
                  OFFER ▾
                </span>
                <div
                  className="absolute top-full left-0 w-56 bg-white text-slate-900 shadow-xl rounded-md
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50"
                >
                  <div className="py-2">
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      ADD OFFER
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      ALL OFFER
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      ALL LINKS PORTAL
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      IMAGE TRANSFER
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1 hover:text-white cursor-pointer">
                <FiShield />
                <span>SUPPRESSION</span>
              </div>

              <div className="relative group h-16 flex items-center cursor-pointer">
                <span className="flex flex-col items-center gap-1 group-hover:text-white">
                  <FiServer />
                  Server Setup ▾
                </span>

                <div
                  className="absolute top-full left-0 w-56 bg-white text-slate-900 shadow-xl rounded-md
               opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50"
                >
                  <div className="py-2">
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      Server Setup Centos
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      Server Setup Ubuntu
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      Sending IP Setup
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* User */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-sm font-bold">{user?.name || 'User'}</span>
              <span className="block text-xs text-slate-400 capitalize">{user?.role || 'Guest'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <Outlet />
      </main>


      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>

        {/* Drawer */}
        <div className={`absolute left-0 top-0 bottom-0 w-[80%] max-w-sm bg-[#1e2329] border-r border-slate-800 shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full overflow-y-auto">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-lg font-bold text-white">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                <FiX size={24} />
              </button>
            </div>

            <div className="flex flex-col">
              <MobileMenuItem
                icon={FiMail}
                label="SMTP"
                menuId="smtp"
                onClick={() => navigate('/dashboard')}
              />

              <MobileMenuItem icon={FiTool} label="TOOLS" menuId="tools">
                <div className="pl-12 py-2 flex flex-col gap-2">
                  <div onClick={() => { }} className="text-slate-400 hover:text-white py-1 cursor-pointer">Data File List</div>
                </div>
              </MobileMenuItem>

              <MobileMenuItem icon={FiLogIn} label="LOGIN" menuId="login">
                <div className="pl-12 py-2 flex flex-col gap-2">
                  <div onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className="text-slate-400 hover:text-white py-1 cursor-pointer">Create Credentials</div>
                </div>
              </MobileMenuItem>

              <MobileMenuItem icon={FiMonitor} label="SCREEN" menuId="screen" onClick={() => { }} />

              <MobileMenuItem icon={FiLayers} label="INTERFACE" menuId="interface">
                <div className="pl-12 py-2 flex flex-col gap-2 text-sm">
                  <div onClick={() => { navigate('/campaigns'); setIsMobileMenuOpen(false); }} className="text-slate-400 hover:text-white py-1 cursor-pointer">CAMPAIGNS</div>
                  <div onClick={() => { navigate('/users'); setIsMobileMenuOpen(false); }} className="text-slate-400 hover:text-white py-1 cursor-pointer">USERS</div>
                  <div onClick={() => { navigate('/activity'); setIsMobileMenuOpen(false); }} className="text-slate-400 hover:text-white py-1 cursor-pointer">ACTIVITY LOGS</div>
                  <div className="border-t border-slate-700 my-1"></div>
                  <div className="text-slate-400 hover:text-white py-1 cursor-pointer">MAIN SERVER</div>
                  <div className="text-slate-400 hover:text-white py-1 cursor-pointer">NEW INTERFACE</div>
                  {/* Add more interface items as needed or truncate for mobile */}
                </div>
              </MobileMenuItem>

              <MobileMenuItem icon={FiGrid} label="TESTIDS PORTAL" menuId="testids">
                <div className="pl-12 py-2 flex flex-col gap-2 text-sm">
                  <div className="text-slate-400 hover:text-white py-1 cursor-pointer">Testids Management</div>
                  <div className="text-slate-400 hover:text-white py-1 cursor-pointer">Testids Screen</div>
                </div>
              </MobileMenuItem>

              <MobileMenuItem icon={FiDatabase} label="DATA" menuId="data">
                <div className="pl-12 py-2 flex flex-col gap-2 text-sm">
                  <div className="text-slate-400 hover:text-white py-1 cursor-pointer">DATA DOWNLOAD</div>
                  <div className="text-slate-400 hover:text-white py-1 cursor-pointer">DATA UPLOAD</div>
                </div>
              </MobileMenuItem>

              <MobileMenuItem icon={FiTag} label="OFFER" menuId="offer">
                <div className="pl-12 py-2 flex flex-col gap-2 text-sm">
                  <div className="text-slate-400 hover:text-white py-1 cursor-pointer">ALL OFFER</div>
                </div>
              </MobileMenuItem>

              <MobileMenuItem icon={FiShield} label="SUPPRESSION" menuId="suppression" onClick={() => { }} />

              <MobileMenuItem icon={FiServer} label="Server Setup" menuId="server">
                <div className="pl-12 py-2 flex flex-col gap-2 text-sm">
                  <div className="text-slate-400 hover:text-white py-1 cursor-pointer">Centos Setup</div>
                  <div className="text-slate-400 hover:text-white py-1 cursor-pointer">Ubuntu Setup</div>
                </div>
              </MobileMenuItem>

              <div className="p-4 border-t border-slate-800 mt-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-white">{user?.name || 'User'}</div>
                    <div className="text-xs text-slate-400 capitalize">{user?.role || 'Guest'}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-medium transition-colors"
                >
                  Logout
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div >
  );
};

export default MainLayout;
