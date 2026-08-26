use std::{char::Title, path::StripPrefixError};

use printpdf::*;

#[tauri::command]
pub fn generate_pdf(title: String,
    resum: String,
    route: String,
    image_b64: String) -> Result<String, String> {
    print!("Generating PDF...");

    let mut doc = PdfDocument::new(&title);
    let font_bytes = include_bytes!("../../../default_fonts/...");
    let mut font_warnings = Vec::new();
    let font = ParsedFont::from_bytes(font_bytes, 0, &mut font_warnings).map_err(|e| format!("Failed to load font: {}", e))?;

    let mut ops = Vec::new();
    ops.push(Op::StartTextSection);
    ops.push(Op::SetTextCursor { pos: Point { x: Mm(20.0).into(), y: Mm(200.0).into() } });
    ops.push(Op::ShowText { items: vec![TextItem::Text((resum))] });
    ops.push(Op::EndTextSection);

    let bytes = base64::decode(image_b64).map_err(|e| format!("Failed to decode base64 image: {}", e))?;
    let mut image_warnings = Vec::new();
    let image = RawImage::decode_from_bytes(&bytes, &mut image_warnings).map_err(|e| format!("Failed to decode image: {}", e))?;
    let xobj_id = doc.add_image(&image);
    ops.push(Op::UseXobject { id: xobj_id, transform: XObjectTransform::default() });

    let page = PdfPage::new(Mm(210.0), Mm(297.0), ops);
    let mut save_warnings = Vec::new();
    let pdf_bytes = doc.with_pages(vec![page]).save(&PdfSaveOptions::default(), &mut save_warnings).map_err(|e| format!("Failed to save PDF: {}", e))?;

    Ok(route)
}