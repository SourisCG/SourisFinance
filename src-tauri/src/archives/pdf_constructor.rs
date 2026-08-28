use base64::{engine::general_purpose::STANDARD, Engine as _};
use printpdf::*;

#[derive(Debug, Clone, serde::Deserialize)]
pub struct ReportRow{
    kind: String,
    amount: f64,
    description: String,
}
#[derive(Debug, Clone, serde::Deserialize)]
pub struct ReportBlock{
    title: String,
    rows: Vec<ReportRow>,
    income_total: f64,
    expense_total: f64,
}

fn text_ops(text: &str, x: Mm, y: Mm, size: Pt) -> Vec<Op> {
    vec![
        Op::StartTextSection,
        Op::SetFont { font: PdfFontHandle::Builtin(BuiltinFont::Helvetica), size },
        Op::SetTextCursor { pos: Point::new(x, y) },
        Op::ShowText { items: vec![TextItem::Text(text.to_string())] },
        Op::EndTextSection
    ]
}
fn render_block(block: &ReportBlock) -> Vec<Op> {
    let mut ops = Vec::new();
    let mut y = Mm(280.0);

    ops.extend(text_ops(&block.title, Mm(20.0), y, Pt(16.0)));
    y = Mm(y.0 - 12.0);
    ops.extend(text_ops("Type", Mm(20.0), y, Pt(11.0)));
    ops.extend(text_ops("Amount", Mm(80.0), y, Pt(11.0)));
    ops.extend(text_ops("Description", Mm(130.0), y, Pt(11.0)));

    for row in &block.rows {
        y = Mm(y.0 - 10.0);
        ops.extend(text_ops(&row.kind, Mm(20.0), y, Pt(10.0)));
        ops.extend(text_ops(&format!("${:.2}", row.amount), Mm(80.0), y, Pt(10.0)));
        ops.extend(text_ops(&row.description, Mm(130.0), y, Pt(10.0)));
    }
    ops
}

#[tauri::command]
pub fn generate_pdf(
    title: String,
    blocks: Vec<ReportBlock>,
    image_b64: String,
    route: String
) -> Result<String, String> {
    let mut doc = PdfDocument::new(&title);
    let mut pages = Vec::new();
    let bytes = STANDARD.decode(image_b64).map_err(|e| format!("Error decoding base64: {}", e))?;
    let image = RawImage::decode_from_bytes(&bytes, &mut Vec::new()).map_err(|e| format!("Error decoding image: {}", e))?;
    let xobj_id = doc.add_image(&image);
    for (i, block) in blocks.iter().enumerate() {
        let mut page_ops = Vec::new();
        if i == 0 {
            page_ops.push(Op::UseXobject { id: xobj_id.clone(), transform: XObjectTransform{scale_x: Some(0.5), scale_y: Some(0.5), translate_x: Some(Pt(20.0)), translate_y: Some(Pt(150.0)), ..Default::default() } });
        }
        page_ops.extend(render_block(block));
        pages.push(PdfPage::new(Mm(210.0), Mm(297.0), page_ops));
    }
    let pdf_bytes = doc.with_pages(pages).save(&PdfSaveOptions::default(), &mut Vec::new());

    std::fs::write(&route, pdf_bytes).map_err(|e| format!("Error writing file: {}", e))?;
    Ok(route)
}