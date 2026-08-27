use std::vec;

use base64::{engine::general_purpose::STANDARD, Engine as _};
use printpdf::*;

#[tauri::command]
pub fn generate_pdf() -> Result<String, String> {
    let mut doc = PdfDocument::new("My report");
    let mut ops = Vec::new();
    
    ops.push(Op::StartTextSection);
    ops.push(Op::SetTextCursor { pos: Point::new(Mm(20.0), Mm(258.0)) });
    ops.push(Op::ShowText { items: vec![TextItem::Text("My report".into())] });
    ops.push(Op::EndTextSection);

    let page = PdfPage::new(Mm(210.0), Mm(297.0), ops);
    let pdf_bytes = doc.with_pages(vec![page]).save(&PdfSaveOptions::default(), &mut Vec::new());

    std::fs::write("report.pdf", pdf_bytes).map_err(|e| format!("Error writing file: {}", e))?;
    Ok("No done".to_string())
}