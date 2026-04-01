import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const solutionPath = join(process.cwd(), 'src', 'lib', 'solutions', `${params.id}.ipynb`);
    const content = await readFile(solutionPath, 'utf-8');
    const notebook = JSON.parse(content);

    // Extract code cells from the notebook
    const cells = notebook.cells || [];
    const codeCells = cells
      .filter((cell: any) => cell.cell_type === 'code')
      .map((cell: any) => {
        const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
        const outputs = cell.outputs || [];
        return { source, outputs };
      });

    return NextResponse.json({ cells: codeCells });
  } catch (error) {
    return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
  }
}
