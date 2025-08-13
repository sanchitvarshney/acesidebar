type SettingsMenuProps = {
  onSelect?: any;
  menuSections?: any;
  activeId?: any;
};

const SettingsMenu = ({
  onSelect,
  menuSections,
  activeId,
}: SettingsMenuProps) => {
  return (
    <aside className="w-80 min-w-[320px] border-r bg-white flex flex-col h-[calc(100vh-90px)] p-2 overflow-y-auto">
      {menuSections.length > 0 ? (
        menuSections.map((section: any) => (
          <div
            key={section.id}
            className={`flex items-start gap-4 mb-6 cursor-pointer p-2 rounded-md transition-colors
              ${activeId === section.id ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => onSelect(section.id)}
          >
            <div>{section.icon({ className: section.iconClass })}</div>
            <div>
              <div className="font-semibold text-gray-800 text-base mb-0.5">
                {section.title}
              </div>
              <div className="text-gray-500 text-sm leading-tight">
                {section.description}
              </div>
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
