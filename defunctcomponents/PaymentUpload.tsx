import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Landmark, FileText, Upload, Copy, Check, Trash2, HelpCircle } from 'lucide-react';
import { Profile } from '../types';
import { BANK_DETAILS } from '../data';

interface PaymentUploadProps {
  currentProfile: Profile;
  onPopUpload: (popUrl: string) => void;
  onLogout: () => void;
}

export default function PaymentUpload({ currentProfile, onPopUpload, onLogout }: PaymentUploadProps) {
  const [copiedText, setCopiedText] = useState<'zwg' | 'usd' | 'ref' | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; dataUrl: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate reference code based on last 4 digits of phone
  const cleanPhone = currentProfile.phone.replace(/[^0-9]/g, '');
  const refSuffix = cleanPhone.length >= 4 ? cleanPhone.slice(-4) : currentProfile.id.slice(0, 4).toUpperCase();
  const paymentReference = `LSS26-${refSuffix}`;

  const copyToClipboard = (text: string, type: 'zwg' | 'usd' | 'ref') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Drag and Drop Handling
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmitPop = () => {
    if (!selectedFile) return;
    setIsUploading(true);

    // Simulate small backend network timeout
    setTimeout(() => {
      onPopUpload(selectedFile.dataUrl);
      setIsUploading(false);
    }, 1200);
  };

  return (
    <div className="bg-[#FCFBF7] text-[#1A1A1A] font-sans min-h-screen py-16 px-6 flex items-center justify-center">
      <div className="max-w-4xl w-full grid md:grid-cols-12 bg-white border border-black/10 rounded-none overflow-hidden">
        
        {/* Left Side: Bank Details */}
        <div className="md:col-span-6 p-8 bg-[#FCFBF7] border-b md:border-b-0 md:border-r border-black/10 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 bg-black text-white flex items-center justify-center font-serif font-bold text-xs">
                LSS
              </span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-green-800 uppercase">
                Payment Verification Unit
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-serif font-bold text-[#1A1A1A]">
                Bank Transfer Instructions
              </h1>
              <p className="text-xs text-black/60 leading-relaxed">
                Your registration invoice has been created successfully. To unlock your exhibition portal, B2B trade directory, and download entry badges, please complete a bank transfer and upload your statement/receipt.
              </p>
            </div>

            {/* Bank Credentials Cards */}
            <div className="space-y-3">
              <div className="p-4 bg-white border border-black/10 rounded-none relative hover:border-black transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-green-800 bg-green-50 px-2 py-0.5 border border-green-800/10 font-bold">
                    ZWG Account
                  </span>
                  <Landmark className="h-4 w-4 text-black/40" />
                </div>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-black/40 text-[9px] font-mono uppercase tracking-wider">BANK Name</span>
                    <p className="font-bold text-[#1A1A1A]">{BANK_DETAILS.bankName}</p>
                  </div>
                  <div>
                    <span className="text-black/40 text-[9px] font-mono uppercase tracking-wider">ACCOUNT Number</span>
                    <p className="font-mono font-bold text-[#1A1A1A] flex items-center gap-1.5 mt-0.5">
                      {BANK_DETAILS.zwgAccountNumber}
                      <button
                        id="btn-copy-zwg"
                        onClick={() => copyToClipboard(BANK_DETAILS.zwgAccountNumber, 'zwg')}
                        className="text-black/30 hover:text-black p-0.5 cursor-pointer"
                      >
                        {copiedText === 'zwg' ? <Check className="h-3.5 w-3.5 text-green-800" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border border-black/10 rounded-none relative hover:border-black transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-green-800 bg-green-50 px-2 py-0.5 border border-green-800/10 font-bold">
                    NOSTRO USD Account
                  </span>
                  <Landmark className="h-4 w-4 text-black/40" />
                </div>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-black/40 text-[9px] font-mono uppercase tracking-wider">BANK Name</span>
                    <p className="font-bold text-[#1A1A1A]">{BANK_DETAILS.bankName}</p>
                  </div>
                  <div>
                    <span className="text-black/40 text-[9px] font-mono uppercase tracking-wider">ACCOUNT Number</span>
                    <p className="font-mono font-bold text-[#1A1A1A] flex items-center gap-1.5 mt-0.5">
                      {BANK_DETAILS.nostroUsdAccountNumber}
                      <button
                        id="btn-copy-nostro"
                        onClick={() => copyToClipboard(BANK_DETAILS.nostroUsdAccountNumber, 'usd')}
                        className="text-black/30 hover:text-black p-0.5 cursor-pointer"
                      >
                        {copiedText === 'usd' ? <Check className="h-3.5 w-3.5 text-green-800" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mandatory Reference Code */}
            <div className="p-4 bg-white border border-black/10 rounded-none space-y-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-green-800 font-bold block">
                Mandatory Bank Reference Format
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm tracking-wide bg-[#FCFBF7] px-3 py-1.5 border border-black/10 text-stone-900">
                  {paymentReference}
                </span>
                <button
                  id="btn-copy-reference"
                  onClick={() => copyToClipboard(paymentReference, 'ref')}
                  className="bg-black text-white hover:bg-green-950 font-mono text-[10px] uppercase font-bold px-4 py-2 rounded-none flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedText === 'ref' ? (
                    <>
                      <Check className="h-3 w-3" /> COPIED
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> COPY REF
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-black/50 leading-normal font-sans">
                Please input this reference code exactly in your banking platform to facilitate automatic audit identification.
              </p>
            </div>
          </div>

          <button
            id="btn-payment-logout"
            onClick={onLogout}
            className="text-black/50 hover:text-black underline text-[11px] font-mono uppercase tracking-wider tracking-tight self-start mt-6 cursor-pointer"
          >
            &larr; Sign Out
          </button>
        </div>

        {/* Right Side: Upload File Panel */}
        <div className="md:col-span-6 p-8 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-base font-serif font-bold text-[#1A1A1A]">
                  Upload Proof of Payment (POP)
                </h2>
                <p className="text-[11px] text-black/40 mt-1">
                  Exhibitor: <strong className="text-[#1A1A1A]">{currentProfile.company_name}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-black/40 uppercase font-bold tracking-wider">Amount Due</span>
                <div className="text-sm font-bold text-green-800">${currentProfile.calculated_total_usd} USD</div>
              </div>
            </div>

            {/* Drag & Drop Zone */}
            {!selectedFile ? (
              <div
                id="dropzone-pop"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-none p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[220px] transition duration-150 ${
                  dragActive
                    ? 'border-green-800 bg-[#FCFBF7]'
                    : 'border-black/10 bg-white hover:border-black/30'
                }`}
              >
                <input
                  id="input-file-pop"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleChange}
                  accept=".png, .jpg, .jpeg, .pdf"
                  className="hidden"
                />
                <div className="h-12 w-12 rounded-none bg-[#FCFBF7] border border-black/10 flex items-center justify-center mb-4">
                  <Upload className="h-5 w-5 text-black/40" />
                </div>
                <h3 className="text-xs font-bold text-[#1A1A1A]">
                  Drag and Drop statement here, or <span className="underline hover:text-green-800">browse files</span>
                </h3>
                <p className="text-[10px] text-black/40 mt-1.5 max-w-xs leading-normal font-sans">
                  Supports PNG, JPG, or PDF statement files up to 5MB. Must show CBZ transaction clearance.
                </p>
              </div>
            ) : (
              /* Selected File Card */
              <div className="border border-black/10 rounded-none p-4 bg-[#FCFBF7] flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 bg-white rounded-none border border-black/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-black/60" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#1A1A1A] truncate">
                      {selectedFile.name}
                    </h4>
                    <p className="text-[10px] text-black/40 font-mono mt-0.5">
                      Size: {selectedFile.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    id="btn-remove-selected-file"
                    onClick={() => setSelectedFile(null)}
                    title="Remove File"
                    className="p-1.5 hover:bg-stone-200 rounded-none text-black/40 hover:text-red-600 transition cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Direct Audit Contacts */}
            <div className="bg-[#FCFBF7] border border-black/10 rounded-none p-4 space-y-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-green-800" />
                <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Need Immediate Approval?</h4>
              </div>
              <p className="text-[10px] text-black/60 leading-relaxed font-sans">
                If you have completed a cash payment directly at the LSS offices in Chiredzi or require express verification, contact the treasurer Fidelis Harry (+263 77 242 6985) or email <a href="mailto:lowveldshowsociety4@gmail.com" className="underline text-[#1A1A1A] font-bold">lowveldshowsociety4@gmail.com</a>.
              </p>
            </div>
          </div>

          <div className="pt-8 mt-6 border-t border-black/10">
            <button
              id="btn-submit-pop-proof"
              disabled={!selectedFile || isUploading}
              onClick={handleSubmitPop}
              className={`w-full font-bold text-xs uppercase tracking-widest py-3.5 rounded-none transition duration-200 ${
                selectedFile && !isUploading
                  ? 'bg-black text-white hover:bg-green-950 cursor-pointer'
                  : 'bg-[#FCFBF7] text-black/30 border border-black/5 cursor-not-allowed'
              }`}
            >
              {isUploading ? 'SECURING TRANSFER FILES...' : 'SUBMIT PROOF OF PAYMENT FOR AUDIT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
