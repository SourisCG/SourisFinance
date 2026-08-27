use base64::{engine::general_purpose::STANDARD, Engine as _};
use printpdf::*;

#[tauri::command]
pub fn generate_pdf(
    title: String,
    resum: String,
    route: String,
    image_b64: String,
) -> Result<String, String> {
    let mut doc = PdfDocument::new(&title);

    let mut ops = Vec::new();
    ops.push(Op::StartTextSection);
    ops.push(Op::SetTextCursor { pos: Point { x: Mm(20.0).into(), y: Mm(280.0).into() } });
    ops.push(Op::SetFont { font: PdfFontHandle::Builtin(BuiltinFont::Helvetica), size: Pt(14.0) });
    ops.push(Op::ShowText { items: vec![TextItem::Text(resum)] });
    ops.push(Op::EndTextSection);

    let bytes = STANDARD.decode(image_b64).map_err(|e| format!("Failed to decode base64 image: {}", e))?;
    let mut image_warnings = Vec::new();
    let image = RawImage::decode_from_bytes(&bytes, &mut image_warnings).map_err(|e| format!("Failed to decode image: {}", e))?;
    let xobj_id = doc.add_image(&image);
    ops.push(Op::UseXobject { id: xobj_id, transform: XObjectTransform::default() });

    let page = PdfPage::new(Mm(210.0), Mm(297.0), ops);
    let mut save_warnings = Vec::new();
    let pdf_bytes = doc.with_pages(vec![page]).save(&PdfSaveOptions::default(), &mut save_warnings);

    std::fs::write(&route, pdf_bytes).map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(route)
}