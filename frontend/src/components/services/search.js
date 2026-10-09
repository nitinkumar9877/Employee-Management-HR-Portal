'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EmployeeFetchApi, EmployeeUpdateApi } from './EmployeeApi';
import styles from '../styleSheets/userById.module.css';

const formatDate = (value) => {
    if (!value) return 'Not provided';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? String(value)
        : date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
};

const dateInputValue = (value) => {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const Detail = ({ label, value }) => (
    <div className={styles.detailItem}>
        <dt>{label}</dt>
        <dd>{value === null || value === undefined || value === '' ? 'Not provided' : value}</dd>
    </div>
);

export function Search() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!params.id) return;

        const fetchEmployee = async () => {
            try {
                setLoading(true);
                setError('');
                const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}employees/${params.id}`;
                const response = await EmployeeFetchApi(apiUrl);
                setEmployee(response?.data ?? response);
            } catch (fetchError) {
                console.error('Failed to fetch employee data:', fetchError);
                setError('We could not load this employee. Please try again later.');
                setEmployee(null);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [params.id]);

    if (loading) {
        return <p className={styles.pageMessage}>Loading employee profile…</p>;
    }

    if (error) {
        return <p className={styles.pageMessage} role="alert">{error}</p>;
    }

    if (!employee) {
        return <p className={styles.pageMessage}>Employee not found.</p>;
    }

    const fullName = [employee.firstName, employee.lastName]
        .filter(Boolean)
        .join(' ');
    const address = employee.address ?? {};

    return (
        <div className={styles.employeeProfile}>
            <section className={styles.profileHero} aria-labelledby="employee-name">
                <div className={styles.profileIntro}>
                    <span className={styles.eyebrow}>Employee profile</span>
                    <h2 id="employee-name">{fullName || 'Employee'}</h2>
                    <p className={styles.profileRole}>
                        {employee.designation || 'Role not provided'}
                        {employee.department ? ` · ${employee.department}` : ''}
                    </p>
                    <span
                        className={`${styles.statusBadge} ${employee.status?.toLowerCase() === 'active'
                            ? styles.statusActive
                            : styles.statusInactive
                            }`}
                    >
                        {employee.status || 'Status not provided'}
                    </span>
                </div>
                <div className={styles.profilePhotoWrap}>
                    {employee.thumbnail ? (
                        <Image
                            className={styles.profilePhoto}
                            src={employee.thumbnail}
                            alt={`${fullName || 'Employee'} profile`}
                            width={170}
                            height={170}
                            unoptimized
                        />
                    ) : (
                        <div className={styles.photoPlaceholder} aria-label="No profile photo">
                            {fullName.charAt(0) || '?'}
                        </div>
                    )}
                </div>
            </section>

            <section className={styles.profileSection} aria-labelledby="personal-details">
                <div className={styles.sectionHeading}>
                    <span className={styles.sectionMarker} />
                    <h3 id="personal-details">Personal details</h3>
                </div>
                <dl className={styles.detailsGrid}>
                    <Detail label="Email" value={employee.email} />
                    <Detail label="Phone" value={employee.phone} />
                    <Detail label="Date joined" value={formatDate(employee.joiningDate)} />
                </dl>
            </section>

            <section className={styles.profileSection} aria-labelledby="address-details">
                <div className={styles.sectionHeading}>
                    <span className={styles.sectionMarker} />
                    <h3 id="address-details">Address</h3>
                </div>
                <dl className={styles.detailsGrid}>
                    <Detail label="City" value={address.city} />
                    <Detail label="State" value={address.state} />
                    <Detail label="Country" value={address.country} />
                </dl>
            </section>

            <section className={styles.profileSection} aria-labelledby="work-details">
                <div className={styles.sectionHeading}>
                    <span className={styles.sectionMarker} />
                    <h3 id="work-details">Work details</h3>
                </div>
                <dl className={styles.detailsGrid}>
                    <Detail label="Department" value={employee.department} />
                    <Detail label="Designation" value={employee.designation} />
                    <Detail label="Salary" value={employee.salary} />
                    <Detail label="Status" value={employee.status} />
                </dl>
            </section>

            {employee.skills?.length > 0 && (
                <section className={styles.profileSection} aria-labelledby="skills-heading">
                    <div className={styles.sectionHeading}>
                        <span className={styles.sectionMarker} />
                        <h3 id="skills-heading">Skills</h3>
                    </div>
                    <div className={styles.cardGrid}>
                        {employee.skills.map((skill, index) => (
                            <article className={styles.infoCard} key={skill._id || `${skill.name}-${index}`}>
                                <h4>{skill.name || 'Skill'}</h4>
                                <p>{skill.level ?? 0}% proficiency</p>
                                <div
                                    className={styles.skillTrack}
                                    role="progressbar"
                                    aria-label={`${skill.name || 'Skill'} proficiency`}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    aria-valuenow={Math.min(100, Math.max(0, Number(skill.level) || 0))}
                                >
                                    <span
                                        className={styles.skillProgress}
                                        style={{
                                            width: `${Math.min(100, Math.max(0, Number(skill.level) || 0))}%`,
                                        }}
                                    />
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {employee.projects?.length > 0 && (
                <section className={styles.profileSection} aria-labelledby="projects-heading">
                    <div className={styles.sectionHeading}>
                        <span className={styles.sectionMarker} />
                        <h3 id="projects-heading">Projects</h3>
                    </div>
                    <div className={styles.cardGrid}>
                        {employee.projects.map((project, index) => (
                            <article
                                className={styles.infoCard}
                                key={project._id || `${project.name}-${index}`}
                            >
                                <h4>{project.name || 'Project'}</h4>
                                <dl className={styles.cardDetails}>
                                    <Detail label="Role" value={project.role} />
                                    <Detail label="Duration" value={project.duration} />
                                </dl>
                                {project.technologies?.length > 0 && (
                                    <div className={styles.tagList} aria-label="Technologies">
                                        {project.technologies.map((technology) => (
                                            <span className={styles.tag} key={technology}>
                                                {technology}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {employee.experience?.length > 0 && (
                <section className={styles.profileSection} aria-labelledby="experience-heading">
                    <div className={styles.sectionHeading}>
                        <span className={styles.sectionMarker} />
                        <h3 id="experience-heading">Experience</h3>
                    </div>
                    <div className={styles.cardGrid}>
                        {employee.experience.map((job, index) => (
                            <article
                                className={styles.infoCard}
                                key={job._id || `${job.company}-${index}`}
                            >
                                <h4>{job.designation || 'Position'}</h4>
                                <p className={styles.cardSubtitle}>{job.company || 'Company not provided'}</p>
                                <p className={styles.experienceDates}>
                                    {formatDate(job.startDate)} – {job.endDate ? formatDate(job.endDate) : 'Present'}
                                </p>
                                {job.technologies?.length > 0 && (
                                    <div className={styles.tagList} aria-label="Technologies">
                                        {job.technologies.map((technology) => (
                                            <span className={styles.tag} key={technology}>
                                                {technology}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}


export function EditProfileUsingId() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState('');

    useEffect(() => {
        if (!params.id) return;

        const fetchEmployee = async () => {
            try {
                setLoading(true);
                setError('');
                const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}employees/${params.id}`;
                const response = await EmployeeFetchApi(apiUrl);
                setEmployee(response?.data ?? response);
            } catch (fetchError) {
                console.error('Failed to fetch employee data:', fetchError);
                setError('We could not load this employee. Please try again later.');
                setEmployee(null);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [params.id]);

    if (loading) {
        return <p className={styles.pageMessage}>Loading employee profile…</p>;
    }

    if (error) {
        return <p className={styles.pageMessage} role="alert">{error}</p>;
    }

    if (!employee) {
        return <p className={styles.pageMessage}>Employee not found.</p>;
    }

    const fullName = [employee.firstName, employee.lastName]
        .filter(Boolean)
        .join(' ');

    const address = employee.address ?? {};
    const editProfile = () => {
        setFormData({
            firstName: employee.firstName ?? '',
            lastName: employee.lastName ?? '',
            thumbnail: employee.thumbnail ?? '',
            email: employee.email ?? '',
            phone: employee.phone ?? '',
            department: employee.department ?? '',
            designation: employee.designation ?? '',
            joiningDate: dateInputValue(employee.joiningDate),
            salary: employee.salary ?? '',
            status: employee.status ?? 'active',
            address: {
                city: address.city ?? '',
                state: address.state ?? '',
                country: address.country ?? '',
            },
        });
        setSaveError('');
        setSaveSuccess('');
        setIsEditing(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name.startsWith('address.')) {
            const addressField = name.slice('address.'.length);
            setFormData((current) => ({
                ...current,
                address: { ...current.address, [addressField]: value },
            }));
            return;
        }
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
            setSaveError('');
            setSaveSuccess('');
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}employees/${params.id}`;
            const response = await EmployeeUpdateApi(apiUrl, {
                ...formData,
                salary: Number(formData.salary),
            });
            if (!response?.updateEmployee) {
                throw new Error('The employee update was not returned by the server.');
            }
            setEmployee(response.updateEmployee);
            setIsEditing(false);
            setSaveSuccess('Employee profile updated successfully.');
        } catch (saveFailure) {
            console.error('Failed to update employee data:', saveFailure);
            setSaveError(
                saveFailure.response?.data?.message
                || 'We could not save these changes. Please try again.'
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.employeeProfile}>
            <section className={styles.profileHero} aria-labelledby="employee-name">
                <div className={styles.profileIntro}>
                    <span className={styles.eyebrow}>Employee profile</span>
                    <h2 id="employee-name">{fullName || 'Employee'}</h2>
                    <p className={styles.profileRole}>
                        {employee.designation || 'Role not provided'}
                        {employee.department ? ` · ${employee.department}` : ''}
                    </p>
                    <span
                        className={`${styles.statusBadge} ${employee.status?.toLowerCase() === 'active'
                            ? styles.statusActive
                            : styles.statusInactive
                            }`}
                    >
                        {employee.status || 'Status not provided'}
                    </span>
                    {!isEditing && (
                        <button className={styles.editButton} type="button" onClick={editProfile}>
                            Edit profile
                        </button>
                    )}
                </div>
                <div className={styles.profilePhotoWrap}>
                    {employee.thumbnail ? (
                        <Image
                            className={styles.profilePhoto}
                            src={employee.thumbnail}
                            alt={`${fullName || 'Employee'} profile`}
                            width={170}
                            height={170}
                            unoptimized
                        />
                    ) : (
                        <div className={styles.photoPlaceholder} aria-label="No profile photo">
                            {fullName.charAt(0) || '?'}
                        </div>
                    )}
                </div>
            </section>

            {saveSuccess && <p className={styles.formSuccess} role="status">{saveSuccess}</p>}
            {isEditing ? (
                <form className={styles.profileSection} onSubmit={handleSubmit}>
                    <div className={styles.sectionHeading}>
                        <span className={styles.sectionMarker} />
                        <h3>Edit employee details</h3>
                    </div>
                    <div className={styles.editFormGrid}>
                        <label className={styles.formField}>
                            First name
                            <input name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                        </label>
                        <label className={styles.formField}>
                            Last name
                            <input name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                        </label>
                        <label className={styles.formField}>
                            Email
                            <input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                        </label>
                        <label className={styles.formField}>
                            Phone
                            <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                        </label>
                        <label className={styles.formField}>
                            Profile photo URL
                            <input name="thumbnail" type="url" value={formData.thumbnail} onChange={handleInputChange} required />
                        </label>
                        <label className={styles.formField}>
                            Date joined
                            <input name="joiningDate" type="date" value={formData.joiningDate} onChange={handleInputChange} required />
                        </label>
                        <label className={styles.formField}>
                            Department
                            <input name="department" value={formData.department} onChange={handleInputChange} required />
                        </label>
                        <label className={styles.formField}>
                            Designation
                            <input name="designation" value={formData.designation} onChange={handleInputChange} required />
                        </label>
                        <label className={styles.formField}>
                            Salary
                            <input name="salary" type="number" min="0" step="any" value={formData.salary} onChange={handleInputChange} required />
                        </label>
                        <label className={styles.formField}>
                            Status
                            <select name="status" value={formData.status} onChange={handleInputChange} required>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </label>
                        <label className={styles.formField}>
                            City
                            <input name="address.city" value={formData.address.city} onChange={handleInputChange} required />
                        </label>
                        <label className={styles.formField}>
                            State
                            <input name="address.state" value={formData.address.state} onChange={handleInputChange} required />
                        </label>
                        <label className={styles.formField}>
                            Country
                            <input name="address.country" value={formData.address.country} onChange={handleInputChange} required />
                        </label>
                    </div>
                    {saveError && <p className={styles.formError} role="alert">{saveError}</p>}
                    <div className={styles.formActions}>
                        <button className={styles.cancelButton} type="button" onClick={() => setIsEditing(false)} disabled={saving}>
                            Cancel
                        </button>
                        <button className={styles.saveButton} type="submit" disabled={saving}>
                            {saving ? 'Saving…' : 'Save changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <section className={styles.profileSection} aria-labelledby="personal-details">
                        <div className={styles.sectionHeading}>
                            <span className={styles.sectionMarker} />
                            <h3 id="personal-details">Personal details</h3>
                        </div>
                        <dl className={styles.detailsGrid}>
                            <Detail label="Email" value={employee.email} />
                            <Detail label="Phone" value={employee.phone} />
                            <Detail label="Date joined" value={formatDate(employee.joiningDate)} />
                        </dl>
                    </section>

                    <section className={styles.profileSection} aria-labelledby="address-details">
                        <div className={styles.sectionHeading}>
                            <span className={styles.sectionMarker} />
                            <h3 id="address-details">Address</h3>
                        </div>
                        <dl className={styles.detailsGrid}>
                            <Detail label="City" value={address.city} />
                            <Detail label="State" value={address.state} />
                            <Detail label="Country" value={address.country} />
                        </dl>
                    </section>

                    <section className={styles.profileSection} aria-labelledby="work-details">
                        <div className={styles.sectionHeading}>
                            <span className={styles.sectionMarker} />
                            <h3 id="work-details">Work details</h3>
                        </div>
                        <dl className={styles.detailsGrid}>
                            <Detail label="Department" value={employee.department} />
                            <Detail label="Designation" value={employee.designation} />
                            <Detail label="Salary" value={employee.salary} />
                            <Detail label="Status" value={employee.status} />
                        </dl>
                    </section>

                    {employee.skills?.length > 0 && (
                        <section className={styles.profileSection} aria-labelledby="skills-heading">
                            <div className={styles.sectionHeading}>
                                <span className={styles.sectionMarker} />
                                <h3 id="skills-heading">Skills</h3>
                            </div>
                            <div className={styles.cardGrid}>
                                {employee.skills.map((skill, index) => (
                                    <article className={styles.infoCard} key={skill._id || `${skill.name}-${index}`}>
                                        <h4>{skill.name || 'Skill'}</h4>
                                        <p>{skill.level ?? 0}% proficiency</p>
                                        <div
                                            className={styles.skillTrack}
                                            role="progressbar"
                                            aria-label={`${skill.name || 'Skill'} proficiency`}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                            aria-valuenow={Math.min(100, Math.max(0, Number(skill.level) || 0))}
                                        >
                                            <span
                                                className={styles.skillProgress}
                                                style={{
                                                    width: `${Math.min(100, Math.max(0, Number(skill.level) || 0))}%`,
                                                }}
                                            />
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {employee.projects?.length > 0 && (
                        <section className={styles.profileSection} aria-labelledby="projects-heading">
                            <div className={styles.sectionHeading}>
                                <span className={styles.sectionMarker} />
                                <h3 id="projects-heading">Projects</h3>
                            </div>
                            <div className={styles.cardGrid}>
                                {employee.projects.map((project, index) => (
                                    <article
                                        className={styles.infoCard}
                                        key={project._id || `${project.name}-${index}`}
                                    >
                                        <h4>{project.name || 'Project'}</h4>
                                        <dl className={styles.cardDetails}>
                                            <Detail label="Role" value={project.role} />
                                            <Detail label="Duration" value={project.duration} />
                                        </dl>
                                        {project.technologies?.length > 0 && (
                                            <div className={styles.tagList} aria-label="Technologies">
                                                {project.technologies.map((technology) => (
                                                    <span className={styles.tag} key={technology}>
                                                        {technology}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {employee.experience?.length > 0 && (
                        <section className={styles.profileSection} aria-labelledby="experience-heading">
                            <div className={styles.sectionHeading}>
                                <span className={styles.sectionMarker} />
                                <h3 id="experience-heading">Experience</h3>
                            </div>
                            <div className={styles.cardGrid}>
                                {employee.experience.map((job, index) => (
                                    <article
                                        className={styles.infoCard}
                                        key={job._id || `${job.company}-${index}`}
                                    >
                                        <h4>{job.designation || 'Position'}</h4>
                                        <p className={styles.cardSubtitle}>{job.company || 'Company not provided'}</p>
                                        <p className={styles.experienceDates}>
                                            {formatDate(job.startDate)} – {job.endDate ? formatDate(job.endDate) : 'Present'}
                                        </p>
                                        {job.technologies?.length > 0 && (
                                            <div className={styles.tagList} aria-label="Technologies">
                                                {job.technologies.map((technology) => (
                                                    <span className={styles.tag} key={technology}>
                                                        {technology}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}