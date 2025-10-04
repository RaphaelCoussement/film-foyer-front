import React from "react";

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-80 shadow-xl text-center">
                <h3 className="text-lg font-semibold mb-4">
                    Supprimer « {title} » ?
                </h3>
                <p className="text-gray-600 mb-6">
                    Cette action est irréversible. Es-tu sûr de vouloir continuer ?
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
                        onClick={onClose}
                    >
                        Annuler
                    </button>
                    <button
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition cursor-pointer"
                        onClick={onConfirm}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}