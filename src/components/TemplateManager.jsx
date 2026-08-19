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

  // Ensure there's always at least the main template
  const templateList = templates && templates.length > 0 
    ? templates 
    : [{ id: 'main-template', name: 'Main 9:16 Branded Template' }];

  const currentTemplate = templateList.find((t) => t.id === activeTemplateId) || templateList[0];

  return (
    <div className="control-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="card-title" style={{ color: '#a5b4fc', margin: 0 }}>
          <Bookmark size={15} />
          <span>Preset Template</span>
        </div>

        {/* Simple Mode Toggle */}
        <button
          type="button"
          onClick={() => onToggleSimpleMode(!isSimpleMode)}
          style={{
            background: isSimpleMode ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)',
            border: isSimpleMode ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(99, 102, 241, 0.3)',
            color: isSimpleMode ? '#34d399' : '#a5b4fc',
            fontSize: '11px',
            fontWeight: 700,
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
          <SlidersHorizontal size={12} />
          {isSimpleMode ? 'Simple Mode' : 'Customize Mode'}
        </button>
      </div>

      {/* Template Selector Dropdown & Actions */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <select
          value={activeTemplateId || 'main-template'}
          onChange={(e) => onSelectTemplate(e.target.value)}
          style={{ flex: 1, fontWeight: 600, borderColor: 'rgba(99, 102, 241, 0.4)' }}
        >
          {templateList.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name || t.id}
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
          {saveSuccess ? <Check size={14} style={{ color: '#34d399' }} /> : <Save size={14} />}
          <span>{saveSuccess ? 'Saved' : 'Save'}</span>
        </button>

        {/* New Template Trigger */}
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setIsSavingNew(!isSavingNew)}
          style={{ padding: '8px 10px', fontSize: '12px' }}
          title="Save as new template preset"
        >
          <Plus size={14} />
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
            style={{ padding: '8px 10px', color: '#f87171' }}
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
            placeholder="New Template Name (e.g. Clean Reels Style)"
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
            Save Preset
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsSavingNew(false)}
            style={{ padding: '7px 10px', fontSize: '12px' }}
          >
            Cancel
          </button>
        </form>
      )}

      <div style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
        <span>
          {isSimpleMode ? (
            <span style={{ color: '#34d399' }}>✨ Mode Cepat: Pilih video & ketik caption. Format otomatis pas.</span>
          ) : (
            <span>Semua posisi, logo, twibbon, dan warna tersimpan rapi di template.</span>
          )}
        </span>
      </div>
    </div>
  );
};
