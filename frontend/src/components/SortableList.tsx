import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useFileContext } from '../context/FileContext';
import { FileCard } from './FileCard';

export const SortableList = () => {
    const { files, reorderFiles } = useFileContext();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = files.findIndex((f) => f.id === active.id);
            const newIndex = files.findIndex((f) => f.id === over.id);
            reorderFiles(arrayMove(files, oldIndex, newIndex));
        }
    };

    if (files.length === 0) return null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-4">
                <SortableContext
                    items={files.map(f => f.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {files.map((file) => (
                        <FileCard key={file.id} file={file} />
                    ))}
                </SortableContext>
            </div>
        </DndContext>
    );
};
