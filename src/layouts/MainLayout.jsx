import React from "react";
import { Outlet } from "react-router-dom";
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
} from "react-icons/fi";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#181c20] text-slate-100">
      <header className="bg-[#343a40] border-b border-slate-800">
        <div className="px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="text-xl font-bold text-white">MJ</div>

            {/* NAV */}
            <nav className="hidden md:flex items-center space-x-6 text-sm text-slate-300 text-[rgba(255,255,255,.5)]">
              <div className="flex flex-col items-center gap-1 hover:text-white cursor-pointer">
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
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
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
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                      MAIN SERVER
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
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
            <span className="text-sm">NITISH</span>
            <button className="bg-red-600 px-3 py-1 rounded text-xs">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
