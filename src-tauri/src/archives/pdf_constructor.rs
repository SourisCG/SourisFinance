use base64::{engine::general_purpose::STANDARD, Engine as _};
use printpdf::*;

const MM_TO_PT: f32 = 72.0 / 25.4;

fn pt(mm: f32) -> Pt {
    Pt(mm * MM_TO_PT)
}

fn navy() -> Color {
    Color::Rgb(Rgb::new(0.13, 0.17, 0.35, None))
}

fn header_bg() -> Color {
    Color::Rgb(Rgb::new(0.21, 0.26, 0.54, None))
}

fn zebra_bg() -> Color {
    Color::Rgb(Rgb::new(0.93, 0.94, 0.96, None))
}

fn income_green() -> Color {
    Color::Rgb(Rgb::new(0.0, 0.55, 0.22, None))
}

fn expense_red() -> Color {
    Color::Rgb(Rgb::new(0.78, 0.15, 0.18, None))
}

fn text_white() -> Color {
    Color::Rgb(Rgb::new(1.0, 1.0, 1.0, None))
}

fn text_black() -> Color {
    Color::Rgb(Rgb::new(0.12, 0.13, 0.15, None))
}

fn subtle_gray() -> Color {
    Color::Rgb(Rgb::new(0.45, 0.48, 0.52, None))
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct ReportRow {
    kind: String,
    amount: f64,
    description: String,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct ReportBlock {
    title: String,
    rows: Vec<ReportRow>,
    income_total: f64,
    expense_total: f64,
}

fn text_ops(text: &str, x: Mm, y: Mm, size: Pt, font: BuiltinFont, color: Color) -> Vec<Op> {
    vec![
        Op::StartTextSection,
        Op::SetFont { font: PdfFontHandle::Builtin(font), size },
        Op::SetFillColor { col: color },
        Op::SetTextCursor { pos: Point::new(x, y) },
        Op::ShowText { items: vec![TextItem::Text(text.to_string())] },
        Op::EndTextSection,
    ]
}

fn filled_rect(x_mm: f32, y_mm: f32, w_mm: f32, h_mm: f32, color: Color) -> Vec<Op> {
    vec![
        Op::SetFillColor { col: color },
        Op::DrawRectangle {
            rectangle: Rect::from_xywh(pt(x_mm), pt(y_mm), pt(w_mm), pt(h_mm)),
        },
    ]
}

fn render_block(block: &ReportBlock) -> Vec<Op> {
    let mut ops = Vec::new();
    ops.push(Op::SetOutlineThickness { pt: Pt(0.0) });

    let mut y = Mm(280.0);

    ops.extend(text_ops(&block.title, Mm(20.0), y, Pt(16.0), BuiltinFont::HelveticaBold, navy()));
    ops.extend(filled_rect(20.0, 272.0, 70.0, 2.0, navy()));

    y = Mm(y.0 - 14.0);
    ops.extend(filled_rect(20.0, y.0 - 4.0, 180.0, 9.0, header_bg()));
    ops.extend(text_ops("Type", Mm(20.0), y, Pt(10.5), BuiltinFont::HelveticaBold, text_white()));
    ops.extend(text_ops("Amount", Mm(80.0), y, Pt(10.5), BuiltinFont::HelveticaBold, text_white()));
    ops.extend(text_ops("Description", Mm(130.0), y, Pt(10.5), BuiltinFont::HelveticaBold, text_white()));

    for (idx, row) in block.rows.iter().enumerate() {
        y = Mm(y.0 - 10.0);
        if idx % 2 == 1 {
            ops.extend(filled_rect(20.0, y.0 - 4.0, 180.0, 8.0, zebra_bg()));
        }
        ops.extend(text_ops(&row.kind, Mm(20.0), y, Pt(10.0), BuiltinFont::Helvetica, text_black()));
        ops.extend(text_ops(&format!("${:.2}", row.amount), Mm(80.0), y, Pt(10.0), BuiltinFont::Helvetica, text_black()));
        ops.extend(text_ops(&row.description, Mm(130.0), y, Pt(10.0), BuiltinFont::Helvetica, text_black()));
    }

    y = Mm(y.0 - 14.0);
    ops.push(Op::SetOutlineThickness { pt: Pt(0.6) });
    ops.push(Op::SetOutlineColor { col: subtle_gray() });
    ops.push(Op::DrawLine {
        line: Line {
            points: vec![
                LinePoint { p: Point::new(Mm(20.0), y), bezier: false },
                LinePoint { p: Point::new(Mm(200.0), y), bezier: false },
            ],
            is_closed: false,
        },
    });

    y = Mm(y.0 - 8.0);
    ops.extend(text_ops(&format!("Income total:  ${:.2}", block.income_total), Mm(20.0), y, Pt(11.0), BuiltinFont::HelveticaBold, income_green()));

    y = Mm(y.0 - 8.0);
    ops.extend(text_ops(&format!("Expense total:  ${:.2}", block.expense_total), Mm(20.0), y, Pt(11.0), BuiltinFont::HelveticaBold, expense_red()));

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

    let mut cover_ops = text_ops(&title, Mm(20.0), Mm(285.0), Pt(22.0), BuiltinFont::HelveticaBold, navy());
    cover_ops.extend(filled_rect(20.0, 281.0, 70.0, 2.5, navy()));
    cover_ops.extend(text_ops("Monthly summary", Mm(20.0), Mm(275.0), Pt(11.0), BuiltinFont::HelveticaOblique, subtle_gray()));
    cover_ops.push(Op::UseXobject {
        id: xobj_id.clone(),
        transform: XObjectTransform {
            scale_x: Some(2.5),
            scale_y: Some(2.5),
            translate_x: Some(Pt(88.0)),
            translate_y: Some(Pt(330.0)),
            ..Default::default()
        },
    });
    pages.push(PdfPage::new(Mm(210.0), Mm(297.0), cover_ops));

    for block in &blocks {
        pages.push(PdfPage::new(Mm(210.0), Mm(297.0), render_block(block)));
    }

    let pdf_bytes = doc.with_pages(pages).save(&PdfSaveOptions::default(), &mut Vec::new());

    std::fs::write(&route, pdf_bytes).map_err(|e| format!("Error writing file: {}", e))?;
    Ok(route)
}