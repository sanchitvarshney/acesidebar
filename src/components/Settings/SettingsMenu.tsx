type SettingsMenuProps = {
  onSelect?: any;
  menuSections?: any;
  activeId?: any;
  onSubsectionSelect?: (sectionId: string, subsectionId: string) => void;
};

const SettingsMenu = ({
  onSelect,
  menuSections,
  activeId,
  onSubsectionSelect,
}: SettingsMenuProps) => {
  return (
    <aside className="w-80 min-w-[320px] border-r border-gray-200 bg-white flex flex-col h-[calc(100vh-98px)] p-4 overflow-y-auto shadow-sm">
      {menuSections.length > 0 ? (
        menuSections.map((section: any) => (
          <div key={section.id} className="mb-4">
            {/* Main Section */}
            <div
              className={`flex items-start gap-4 mb-2 cursor-pointer p-4 rounded-lg transition-all duration-300 group relative
                ${
                  activeId === section.id
                    ? "bg-blue-50 border-l-4 border-blue-500 shadow-sm"
                    : "hover:bg-gray-50 hover:shadow-sm hover:scale-[1.02] border-l-4 border-transparent"
                }`}
              onClick={() => onSelect(section.id)}
            >
              <div className={`transition-all duration-300 ${
                activeId === section.id 
                  ? "scale-110" 
                  : "group-hover:scale-110"
              }`}>
                {section.icon({ 
                  className: `${section.iconClass} transition-colors duration-300 ${
                    activeId === section.id 
                      ? "text-blue-600" 
                      : "group-hover:text-blue-500"
                  }` 
                })}
              </div>
              <div className="flex-1">
                <div className={`font-semibold text-base mb-1 transition-colors duration-300 ${
                  activeId === section.id 
                    ? "text-blue-800" 
                    : "text-gray-800 group-hover:text-gray-900"
                }`}>
                  {section.title}
                </div>
                <div className={`text-sm leading-tight transition-colors duration-300 ${
                  activeId === section.id 
                    ? "text-blue-600" 
                    : "text-gray-500 group-hover:text-gray-600"
                }`}>
                  {section.description}
                </div>
              </div>
              {/* Active indicator */}
              {activeId === section.id && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>

          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <div className="text-sm font-medium mb-1">No sections found</div>
            <div className="text-xs">Try adjusting your search</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SettingsMenu;
