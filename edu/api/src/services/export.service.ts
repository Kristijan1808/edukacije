import archiver from 'archiver';
import type { Response } from 'express';
import PptxGenJS from 'pptxgenjs';
import { prisma } from '../config/prisma.js';

export async function exportCourseToPptx(courseId: string, res: Response): Promise<void> {
  const course = await prisma.course.findUniqueOrThrow({
    where: { id: courseId },
    include: { lessons: { orderBy: { order: 'asc' } } },
  });

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';

  for (const lesson of course.lessons) {
    const slide = pptx.addSlide();
    slide.addText(lesson.title, { x: 0.6, y: 0.4, w: 12, h: 0.5, fontSize: 26, bold: true });

    let y = 1.2;
    for (const block of lesson.content as any[]) {
      const text = block.data?.text || block.data?.title || block.data?.question;
      if (!text) continue;
      slide.addText(String(text).replace(/<[^>]+>/g, ''), {
        x: 0.8, y, w: 11.5, h: 1, fontSize: 18, breakLine: true,
      });
      y += 1.1;
    }
  }

  const data = await pptx.write({ outputType: 'nodebuffer' });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  res.setHeader('Content-Disposition', `attachment; filename="${course.title}.pptx"`);
  res.send(data);
}

export async function exportCourseToScorm(courseId: string, res: Response): Promise<void> {
  const course = await prisma.course.findUniqueOrThrow({
    where: { id: courseId },
    include: { lessons: { orderBy: { order: 'asc' } } },
  });

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${course.title}-scorm.zip"`);

  const zip = archiver('zip');
  zip.pipe(res);

  const lessonsHtml = course.lessons.map((lesson) => {
    const blocks = (lesson.content as any[])
      .map((block) => `<p>${block.data?.text || block.data?.title || block.data?.question || ''}</p>`)
      .join('');
    return `<section><h2>${lesson.title}</h2>${blocks}</section>`;
  }).join('');

  const html = `<!doctype html><html lang="hr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${course.title}</title><style>body{font-family:Arial;max-width:900px;margin:auto;padding:32px}section{margin-bottom:48px}</style></head><body><h1>${course.title}</h1>${lessonsHtml}<script>try{parent.API?.LMSInitialize('');parent.API?.LMSSetValue('cmi.core.lesson_status','completed');parent.API?.LMSCommit('')}catch(e){console.error(e)}</script></body></html>`;

  const manifest = `<?xml version="1.0" encoding="UTF-8"?><manifest identifier="EDUSTUDIO" version="1.2" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"><organizations default="ORG"><organization identifier="ORG"><title>${course.title}</title><item identifier="ITEM" identifierref="RES"><title>${course.title}</title></item></organization></organizations><resources><resource identifier="RES" type="webcontent" href="index.html" adlcp:scormtype="sco"><file href="index.html"/></resource></resources></manifest>`;

  zip.append(html, { name: 'index.html' });
  zip.append(manifest, { name: 'imsmanifest.xml' });
  await zip.finalize();
}
