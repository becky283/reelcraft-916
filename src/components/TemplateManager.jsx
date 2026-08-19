import React, { useState } from 'react';
import { Bookmark, Save, Trash2, Check, Plus, SlidersHorizontal, Sparkles } from 'lucide-react';

export const TemplateManager = ({
  templates = [],
  activeTemplateId = 'main-template',
  onSelectTemplate,
  onSaveNewTemplate,
  onUpdateCurrentTemplate,
  onDeleteTemplate,
  isSimpleMode,
  onToggleSimpleMode,
}) => {
  const [isSavingNew, setIsSavingNew] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;
    onSaveNewTemplate(newTemplateName.trim());
    setNewTemplateName('');
    setIsSavingNew(false);
    showSuccess();
  };

  const handleUpdate = () => {
    onUpdateCurrentTemplate();
    showSuccess();
  };

  const showSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const templateList = templates && templates.length > 0 
    ? templates 
    : [{ id: 'main-template', name: 'Main 9:16 Branded Template' }];

  const currentTemplate = templateList.find((t) => t.id === activeTemplateId) || templateList[0];

  return (
    <div className="control-card" style={{ border: '1.5px solid rgba(217, 119, 6, 0.35)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="card-title" style={{ color: '#0a192f', margin: 0 }}>
          <Bookmark size={16} style={{ color: '#d97706' }} />
          <span>Preset Template</span>
        </div>

        {/* Simple Mode Toggle */}
        <button
          type="button"
          onClick={() => onToggleSimpleMode(!isSimpleMode)}
          style={{
            background: isSimpleMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(10, 25, 47, 0.08)',
            border: isSimpleMode ? '1.5px solid #d97706' : '1px solid #cbd5e1',
            color: isSimpleMode ? '#b45309' : '#0a192f',
            fontSize: '11px',
            fontWeight: 800,
            padding: '3px 9px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.15s ease',
          }}
          title={isSimpleMode ? "Showing Simple Mode (Video + Caption only)" : "Showing All Customizer Controls"}
        >
          <SlidersHorizontal size={12} style={{ color: isSimpleMode ? '#d97706' : '#0a192f' }} />
          {isSimpleMode ? 'Simple Mode: ON' : 'Customize Mode'}
        </button>
      </div>

      {/* Template Selector Dropdown & Actions */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <select
          value={activeTemplateId || 'main-template'}
          onChange={(e) => onSelectTemplate(e.target.value)}
          style={{ flex: 1, fontWeight: 700, borderColor: 'rgba(217, 119, 6, 0.5)', color: '#0a192f' }}
        >
          {templateList.map((t) => (
            <option key={t.id} value={t.id}>
              ★ {t.name || t.id}
            </option>
          ))}
        </select>

        {/* Quick Save / Update Button */}
        <button
          type="button"
          className="btn-secondary"
          onClick={handleUpdate}
          style={{ padding: '8px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
          title="Save current layout changes to this template"
        >
          {saveSuccess ? <Check size={14} style={{ color: '#059669' }} /> : <Save size={14} style={{ color: '#d97706' }} />}
          <span>{saveSuccess ? 'Saved!' : 'Save'}</span>
        </button>

        {/* New Template Trigger */}
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setIsSavingNew(!isSavingNew)}
          style={{ padding: '8px 10px', fontSize: '12px' }}
          title="Save as new template preset"
        >
          <Plus size={14} style={{ color: '#d97706' }} />
        </button>

        {/* Delete Template (Only for custom templates) */}
        {activeTemplateId && activeTemplateId !== 'main-template' && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              if (window.confirm(`Delete template "${currentTemplate?.name}"?`)) {
                onDeleteTemplate(activeTemplateId);
              }
            }}
            style={{ padding: '8px 10px', color: '#e11d48' }}
            title="Delete this template"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Inline Save New Template Form */}
      {isSavingNew && (
        <form onSubmit={handleSaveSubmit} style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
          <input
            type="text"
            placeholder="Nama Template Baru (misal: Golden Reels Style)"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            autoFocus
            style={{ fontSize: '12.5px', padding: '7px 10px' }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '7px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
          >
            Simpan Preset
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsSavingNew(false)}
            style={{ padding: '7px 10px', fontSize: '12px' }}
          >
            Batal
          </button>
        </form>
      )}

      <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
        <span>
          {isSimpleMode ? (
            <span style={{ color: '#b45309', fontWeight: 600 }}>✨ Mode Cepat: Pilih video & ketik caption. Format otomatis pas.</span>
          ) : (
            <span>Semua posisi, logo, twibbon, dan warna tersimpan rapi di template.</span>
          )}
        </span>
      </div>
    </div>
  );
};
