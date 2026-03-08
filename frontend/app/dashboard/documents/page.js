'use client';

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocs() {
      try {
        const res = await fetch(`${API_BASE}/documents`, { credentials: 'include' });
        const json = await res.json();
        if (json.success) setDocuments(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Documents 📁</h1>
        <p className="mt-1 text-slate-400">
          Manage your uploaded licenses, permits, and business registrations.
        </p>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#00F5FF]/30 border-t-[#00F5FF]" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📄</div>
            <h3 className="text-lg font-medium text-white">No documents yet</h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">
              Documents you upload during your roadmap steps will appear here for easy access.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition">
                <div className="flex items-center gap-3">
                  <span className="text-2xl opacity-80">📄</span>
                  <div>
                    <h4 className="text-white font-medium">{doc.filename}</h4>
                    <p className="text-xs text-slate-400">Uploaded {new Date(doc.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="btn-secondary text-xs px-3 py-1.5 h-auto">Download</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
