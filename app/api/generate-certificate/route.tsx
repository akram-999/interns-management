import { type NextRequest, NextResponse } from "next/server"

interface CertificateData {
  internName: string
  departmentName: string
  startDate: string
  endDate: string
  companyName?: string
  managerName?: string
}

export async function POST(request: NextRequest) {
  try {
    const data: CertificateData = await request.json()

    // In a real application, you would use a PDF generation library like:
    // - jsPDF
    // - Puppeteer
    // - React-PDF
    // - PDFKit

    // For demo purposes, we'll simulate PDF generation
    const certificateHtml = generateCertificateHTML(data)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, you would:
    // 1. Generate actual PDF using a library
    // 2. Save to cloud storage
    // 3. Return download URL

    const mockPdfUrl = `/certificates/${data.internName.replace(/\s+/g, "_")}_certificate.pdf`

    return NextResponse.json({
      success: true,
      certificateUrl: mockPdfUrl,
      fileName: `${data.internName}_Training_Certificate.pdf`,
    })
  } catch (error) {
    console.error("Certificate generation error:", error)
    return NextResponse.json({ error: "Certificate generation failed" }, { status: 500 })
  }
}

function generateCertificateHTML(data: CertificateData): string {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Training Completion Certificate</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          margin: 0;
          padding: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .certificate {
          background: white;
          padding: 60px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 800px;
          width: 100%;
          border: 8px solid #667eea;
        }
        .header {
          margin-bottom: 40px;
        }
        .title {
          font-size: 48px;
          color: #667eea;
          margin-bottom: 10px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 3px;
        }
        .subtitle {
          font-size: 24px;
          color: #666;
          margin-bottom: 40px;
        }
        .content {
          margin: 40px 0;
          line-height: 1.8;
        }
        .intern-name {
          font-size: 36px;
          color: #333;
          font-weight: bold;
          margin: 20px 0;
          text-decoration: underline;
          text-decoration-color: #667eea;
        }
        .details {
          font-size: 18px;
          color: #555;
          margin: 15px 0;
        }
        .department {
          font-weight: bold;
          color: #667eea;
        }
        .footer {
          margin-top: 60px;
          display: flex;
          justify-content: space-between;
          align-items: end;
        }
        .signature {
          text-align: center;
          border-top: 2px solid #333;
          padding-top: 10px;
          width: 200px;
        }
        .date {
          font-size: 16px;
          color: #666;
        }
        .seal {
          width: 100px;
          height: 100px;
          border: 3px solid #667eea;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #667eea;
          margin: 0 auto 20px;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">
          <div class="title">Certificate</div>
          <div class="subtitle">of Training Completion</div>
        </div>
        
        <div class="content">
          <p class="details">This is to certify that</p>
          <div class="intern-name">${data.internName}</div>
          <p class="details">has successfully completed the internship training program in the</p>
          <p class="details department">${data.departmentName} Department</p>
          <p class="details">from ${data.startDate} to ${data.endDate}</p>
          <p class="details">and has demonstrated proficiency in the required skills and competencies.</p>
        </div>
        
        <div class="seal">SEAL</div>
        
        <div class="footer">
          <div class="signature">
            <div>${data.managerName || "Department Manager"}</div>
            <div style="font-size: 14px; color: #666;">Department Manager</div>
          </div>
          <div class="date">
            <div>Date: ${currentDate}</div>
            <div style="font-size: 14px; color: #666;">${data.companyName || "Company Name"}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
