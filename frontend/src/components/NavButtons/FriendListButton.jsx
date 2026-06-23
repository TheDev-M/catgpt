export default function FriendListButton({ open, onToggle, pendingCount = 0 }) {
    return (
        <div className="relative">
            <button
                id="friend-list-button"
                type="button"
                aria-label="Toggle Friend List"
                title={open ? "Close Friend List" : "Open Friend List"}
                onClick={onToggle}
                className="btn btn-primary rounded-full w-12 h-12 shadow-lg transition-transform hover:scale-110 p-0"
            >
                <svg
                    viewBox="0 0 100 100"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    aria-hidden="true"
                >
                    {/* Back person (right) */}
                    <circle cx="64" cy="30" r="14" opacity="0.65" />
                    <path d="M40 80 Q40 56 64 56 Q88 56 88 80 Z" opacity="0.65" />
                    {/* Front person (left) */}
                    <circle cx="36" cy="30" r="14" />
                    <path d="M12 80 Q12 56 36 56 Q60 56 60 80 Z" />
                </svg>
            </button>
            {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 badge badge-warning badge-xs font-bold min-w-5 h-5 flex items-center justify-center">
                    {pendingCount > 9 ? "9+" : pendingCount}
                </span>
            )}
        </div>
    );
}
