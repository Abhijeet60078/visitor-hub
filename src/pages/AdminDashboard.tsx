import { useState } from "react";
import { Users, UserCheck, CalendarDays, Search, Filter, LayoutDashboard, UserSquare2, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NavLink } from "@/components/NavLink";

const mockVisitors = [
  { id: 1, name: "Rahul Sharma", phone: "9876543210", host: "Priya Patel", checkIn: "10:30 AM", status: "active", avatar: "RS" },
  { id: 2, name: "Anita Desai", phone: "9123456789", host: "Vikram Singh", checkIn: "11:15 AM", status: "active", avatar: "AD" },
  { id: 3, name: "John Williams", phone: "9012345678", host: "Neha Gupta", checkIn: "09:00 AM", status: "checked-out", avatar: "JW" },
  { id: 4, name: "Meera Joshi", phone: "9234567890", host: "Arjun Reddy", checkIn: "12:00 PM", status: "active", avatar: "MJ" },
  { id: 5, name: "Kabir Khan", phone: "9345678901", host: "Sanya Malhotra", checkIn: "08:45 AM", status: "checked-out", avatar: "KK" },
  { id: 6, name: "Priya Nair", phone: "9456789012", host: "Ravi Kumar", checkIn: "01:30 PM", status: "active", avatar: "PN" },
];

const stats = [
  { label: "Total Visitors", value: "1,248", icon: Users, color: "bg-primary/10 text-primary" },
  { label: "Active Visitors", value: "24", icon: UserCheck, color: "bg-success/10 text-success" },
  { label: "Today's Visits", value: "67", icon: CalendarDays, color: "bg-warning/10 text-warning" },
];

const AdminDashboard = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = mockVisitors.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.phone.includes(search) || v.host.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-accent-foreground">VMS Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-sidebar-foreground hover:text-sidebar-accent-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/admin" end className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/visitors" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground">
            <UserSquare2 className="w-5 h-5" />
            Visitors
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card flex items-center px-4 sm:px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-card rounded-2xl card-shadow p-5 flex items-center gap-4 hover:card-shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-card rounded-2xl card-shadow p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by name, phone or host..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10 rounded-xl border-border bg-background" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-44 h-10 rounded-xl border-border bg-background">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4">Visitor</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4 hidden sm:table-cell">Phone</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4 hidden md:table-cell">Host</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4 hidden lg:table-cell">Check-In</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v) => (
                    <tr key={v.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                            {v.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{v.name}</p>
                            <p className="text-xs text-muted-foreground sm:hidden">{v.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground hidden sm:table-cell">{v.phone}</td>
                      <td className="px-5 py-4 text-sm text-foreground hidden md:table-cell">{v.host}</td>
                      <td className="px-5 py-4 text-sm text-foreground hidden lg:table-cell">{v.checkIn}</td>
                      <td className="px-5 py-4">
                        <Badge variant={v.status === "active" ? "default" : "secondary"} className={`rounded-full text-xs font-medium ${v.status === "active" ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}`}>
                          {v.status === "active" ? "Active" : "Checked Out"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">No visitors found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
