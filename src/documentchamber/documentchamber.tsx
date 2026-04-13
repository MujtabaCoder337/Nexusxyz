import React, { useState, useRef, useEffect } from 'react';

interface Document {
  name: string;
  status: 'Draft' | 'In Review' | 'Signed';
}

const Documentchamber: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    if (selectedDocIndex !== null && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, [selectedDocIndex]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDocuments([...documents, { name: file.name, status: 'Draft' }]);
    }
  };

  const updateStatus = (index: number, newStatus: 'Draft' | 'In Review' | 'Signed') => {
    const updated = [...documents];
    updated[index].status = newStatus;
    setDocuments(updated);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    drawingRef.current = true;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        e.preventDefault();
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ctx?.beginPath();
      ctx?.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        e.preventDefault();
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ctx?.lineTo(x, y);
      ctx?.stroke();
      ctx?.beginPath();
      ctx?.moveTo(x, y);
    }
  };

  const stopDrawing = () => {
    drawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
      }
    }
  };

  const confirmSignature = (index: number) => {
    updateStatus(index, 'Signed');
    setSelectedDocIndex(null);
    alert('Document signed successfully!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Document Chamber</h2>
      
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Upload Document</h3>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="mb-2"
        />
        <p className="text-sm text-gray-500">Upload PDF or DOC files</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Documents</h3>
        {documents.length === 0 ? (
          <p className="text-gray-500">No documents uploaded yet</p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc, idx) => (
              <div key={idx} className="p-3 border rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <span className={`text-sm px-2 py-1 rounded ${
                    doc.status === 'Draft' ? 'bg-gray-200' :
                    doc.status === 'In Review' ? 'bg-yellow-200' : 'bg-green-200'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => alert(`Preview: ${doc.name}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Preview
                  </button>
                  {doc.status !== 'Signed' && (
                    <>
                      <button
                        onClick={() => updateStatus(idx, 'In Review')}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Send for Review
                      </button>
                      <button
                        onClick={() => setSelectedDocIndex(idx)}
                        className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Sign
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDocIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">E-Signature</h3>
            <canvas
              ref={canvasRef}
              width={350}
              height={200}
              className="border-2 border-gray-300 rounded mb-4 cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            <div className="flex gap-2">
              <button
                onClick={clearSignature}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Clear
              </button>
              <button
                onClick={() => confirmSignature(selectedDocIndex)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm Signature
              </button>
              <button
                onClick={() => setSelectedDocIndex(null)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documentchamber;