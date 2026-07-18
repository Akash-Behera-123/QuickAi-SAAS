import React from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  Scissors,
  SquarePen,
  Users,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  const plan =
    user?.publicMetadata?.plan?.toLowerCase() === "premium"
      ? "Premium Plan"
      : "Free Plan";

  return (
    <aside
      className={`
        fixed md:static
        top-14 left-0
        h-[calc(100vh-56px)]
        w-64
        bg-white
        border-r border-gray-200
        flex flex-col justify-between
        z-50
        transition-transform duration-300 ease-in-out
        ${sidebar ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* Top */}
      <div className="py-7 w-full">
        <div
          onClick={openUserProfile}
          className="flex flex-col items-center cursor-pointer"
        >
          <img
            src={user?.imageUrl}
            alt="User"
            className="w-16 h-16 rounded-full object-cover"
          />

          <h2 className="mt-2 font-semibold text-gray-700 text-center">
            {user?.fullName}
          </h2>
        </div>

        <div className="mt-8 px-3 space-y-2">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setSidebar(false);
                }
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition-all
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 p-4 flex items-center justify-between">
        <div
          onClick={openUserProfile}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src={user?.imageUrl}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover"
          />

          <div>
            <h3 className="text-sm font-medium">{user?.fullName}</h3>
            <p className="text-xs text-gray-500">{plan}</p>
          </div>
        </div>

        <LogOut
          onClick={signOut}
          className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
        />
      </div>
    </aside>
  );
};

export default Sidebar;